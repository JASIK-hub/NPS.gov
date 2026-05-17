import { OrganizationEntity } from './../../../core/db/entities/organization.entity';
import {
  BadRequestException,
  Body,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import * as bcrypt from 'bcrypt';
import { ENV_KEYS } from 'src/core/config/env-keys';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import { TokenResponseDto } from '../dtos/token-response.dto';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginPasswordDto, LoginEmailDto } from '../dtos/login-user.dto';
import { LoginCodeDto } from '../dtos/login-code.dto';
import { OtpService } from './otp.service';
import { CodeMessageDto } from '../dtos/code-message.dto';
import { LoginEcpDto } from '../dtos/login-ecp.dto';
import { EcpService } from './ecp.service';
import { OrganizationService } from 'src/modules/user/services/organization.service';
import { UserRoles } from 'src/modules/user/enums/user-roles.enum';
import { NotifierService } from 'src/modules/notifier/notifier.service';
import { UserEntity } from 'src/core/db/entities/user.entity';
import { SendCodeDto } from '../dtos/send-code.dto';
import { CompleteRegistrationDto } from '../dtos/complete-registration.dto';
import { UserGender } from 'src/modules/user/enums/user-gender.enum';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private tokenService: TokenService,
    private otpService: OtpService,
    private ecpService: EcpService,
    private organizationService: OrganizationService,
    private notifierService: NotifierService,
    private logger:Logger,
  ) {}

  async registerUser(body: RegisterUserDto): Promise<TokenResponseDto> {
    if (!body.email || !body.password) {
      throw new BadRequestException(
        'Email и пароль обязательны для заполнения',
      );
    }
    if (body.email) {
      const existingUser = await this.userService.findOne({
        where: { email: body.email },
      });

      if (existingUser) {
        throw new BadRequestException(
          'Пользователь с таким email уже зарегистрирован',
        );
      }
    }
    body.password = await this.hashPassword(body.password);
    const user = await this.userService.save(body);
    return await this.tokenService.generateTokens({
      id: user.id,
      role: user.role,
    });
  }

  async getTokensForDev(id: number): Promise<TokenResponseDto> {
    const user = await this.userService.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return await this.tokenService.generateTokens({
      id: user.id,
      role: user.role,
    });
  }

  async sendCode(body: SendCodeDto): Promise<CodeMessageDto> {
    const code = await this.otpService.generateCode(body.email);
    await this.notifierService.sendOtpCode(
      body.email,
      code,
      'Your 4 digit code for NPS.gov app',
    );
    return { message: 'code sent' };
  }

  async refreshToken(token: string): Promise<TokenResponseDto> {
    return await this.tokenService.refreshToken(token);
  }

  async logOut(token: string, id: number): Promise<void> {
    await this.tokenService.logOutSession(token, id);
  }

  async loginWithPassword(body: LoginPasswordDto): Promise<TokenResponseDto> {
    const user = await this.userService.findByIdentifier(body.identifier);

    if (!user) {
      throw new BadRequestException('Неверный email/ИИН или пароль');
    }
    if (!user.password) {
      throw new BadRequestException(
        'Для этого аккаунта не установлен пароль. Воспользуйтесь входом по коду.',
      );
    }
    const isPasswordMatching = await bcrypt.compare(
      body.password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new BadRequestException('Неверный email/ИИН или пароль');
    }

    return this.tokenService.generateTokens(user);
  }

  async loginWithCode(body: LoginCodeDto): Promise<TokenResponseDto> {
    const user = await this.userService.findByIdentifier(body.email);

    if (!user) {
      throw new BadRequestException('Пользователь с таким email не найден');
    }
    const isValid = await this.otpService.verifyCode(body.code, body.email);
    if (!isValid) {
      throw new BadRequestException(
        'Неверный код. Проверьте и попробуйте снова.',
      );
    }

    return await this.tokenService.generateTokens({
      id: user.id,
      role: user.role,
    });
  }

  async loginWithEcp(body: LoginEcpDto) {
    const MASTER_KEY = process.env.MASTER_SIGNATURE_KEY;
    try {
      if (MASTER_KEY && body.cms === MASTER_KEY) {
        this.logger.warn(`Test login`);
        return this.createTestUser(body);
      }
    } catch {}
    const ecpData = await this.ecpService.verifyEcp(body.cms, body.data);
    const {
      iin,
      bin,
      firstName,
      lastName,
      gender,
      email,
      organizationName,
      birthday,
    } = ecpData;

    let organization: OrganizationEntity | null = null;

    if (bin) {
      organization = await this.organizationService.findOne({
        where: {
          bin,
        },
      });

      if (!organization) {
        organization = await this.organizationService.createOne({
          bin: bin,
          name: organizationName,
        });
      }
    }

    let user = email
      ? await this.userService.findOne({ where: { email } })
      : null;

    if (!user && iin) {
      user = await this.userService.findOne({ where: { iin } });
    }

    const isNewUser = !user;
    const wasEmailUser = !!user && !user.iin && user.email === email;

    if (isNewUser) {
      user = await this.userService.createOne({
        iin: iin,
        firstName: firstName,
        lastName: lastName,
        gender,
        birthday: birthday ? birthday : undefined,
        email,
        role: bin ? UserRoles.ADMIN : UserRoles.USER,
        organization: organization ? organization : undefined,
      });
    } else if (wasEmailUser && user) {
      await this.userService.update(user.id, {
        iin: iin,
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        gender: gender || user.gender,
        birthday: birthday || user.birthday,
        organization: organization ? organization : user.organization,
      });
      const updatedUser = await this.userService.findOne({
        where: { id: user.id },
      });
      if (updatedUser) {
        user = updatedUser;
      }
    }

    return await this.tokenService.generateTokens({
      id: (user as UserEntity).id,
      role: (user as UserEntity).role,
    });
  }

  async sendPasswordResetCode(email: string): Promise<CodeMessageDto> {
    const user = await this.userService.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Пользователь с таким email не найден');
    }

    const code = await this.otpService.generateCode(email);
    await this.notifierService.sendOtpCode(email, code, 'Сброс пароля NPS.gov');
    return { message: 'Код для сброса пароля отправлен на вашу почту' };
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<CodeMessageDto> {
    const user = await this.userService.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Пользователь с таким email не найден');
    }

    const isValid = await this.otpService.verifyCode(code, email);
    if (!isValid) {
      throw new BadRequestException(
        'Неверный или истекший код. Запросите новый код.',
      );
    }

    const hashedPassword = await this.hashPassword(newPassword);
    await this.userService.update(user.id, { password: hashedPassword });

    return { message: 'Пароль успешно изменён' };
  }

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<CodeMessageDto> {
    const user = await this.userService.findOne({
      where: { id: userId },
      select: ['password'],
    });

    if (!user || !user.password) {
      throw new BadRequestException(
        'У вас не установлен пароль. Воспользуйтесь восстановлением пароля.',
      );
    }

    const isPasswordMatching = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new BadRequestException('Неверный текущий пароль');
    }

    const hashedPassword = await this.hashPassword(newPassword);
    await this.userService.update(userId, { password: hashedPassword });

    return { message: 'Пароль успешно изменён' };
  }

  async getProfile(userId: number) {
    const user = await this.userService.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      hasPassword: !!user.password,
      emailVerified: !!user.emailVerified,
      birthday: user.birthday,
      gender: user.gender,
    };
  }

  async sendEmailVerification(
    userId: number,
    email: string,
  ): Promise<CodeMessageDto> {
    const existingUser = await this.userService.findOne({
      where: { email },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestException(
        'Этот email уже используется другим пользователем',
      );
    }

    const code = await this.otpService.generateCode(email);
    await this.notifierService.sendOtpCode(
      email,
      code,
      'Подтверждение email NPS.gov',
    );
    return { message: 'Код подтверждения отправлен на вашу почту' };
  }

  async verifyEmailWithPassword(
    userId: number,
    email: string,
    code: string,
    password?: string,
  ): Promise<TokenResponseDto> {
    const existingUser = await this.userService.findOne({
      where: { email },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestException(
        'Этот email уже используется другим пользователем',
      );
    }

    const isValid = await this.otpService.verifyCode(code, email);
    if (!isValid) {
      throw new BadRequestException(
        'Неверный или истекший код. Запросите новый код.',
      );
    }

    const updateData: any = { email };
    if (password) {
      updateData.password = await this.hashPassword(password);
    }

    await this.userService.update(userId, updateData);

    const user = await this.userService.findOne({ where: { id: userId } });

    return await this.tokenService.generateTokens({
      id: (user as UserEntity).id,
      role: (user as UserEntity).role,
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = Number(this.configService.get(ENV_KEYS.BCRYPT_SALT));
    return await bcrypt.hash(password, salt);
  }

  async completeRegistration(
    body: CompleteRegistrationDto,
  ): Promise<TokenResponseDto> {
    const {
      phone,
      emailCode,
      firstName,
      lastName,
      birthday,
      gender,
      email,
      password,
    } = body;

    const isValidCode = await this.otpService.verifyCode(emailCode, email);

    if (!isValidCode) {
      throw new BadRequestException('Неверный или истекший код');
    }

    const existingUser = await this.userService.findOne({
      where: [{ phone }, { email }],
    });

    if (existingUser) {
      if (existingUser.phone === phone) {
        throw new BadRequestException(
          'Пользователь с таким номером телефона уже зарегистрирован',
        );
      }
      if (existingUser.email === email) {
        throw new BadRequestException(
          'Пользователь с таким email уже зарегистрирован',
        );
      }
    }

    const userData: any = {
      firstName,
      lastName,
      phone,
      birthday,
      gender,
      email,
      emailVerified: true,
    };

    if (password) {
      userData.password = await this.hashPassword(password);
    }

    const user = await this.userService.save(userData);

    try {
      if (email) {
        await this.notifierService.sendWelcomeEmail(
          email,
          `${firstName} ${lastName}`.trim(),
        );
      }
    } catch {}

    return await this.tokenService.generateTokens({
      id: user.id,
      role: user.role,
    });
  }
  
  private async createTestUser(body: LoginEcpDto) {
    const userData = JSON.parse(body.data);

    const {
      iin,
      bin,
      firstName,
      lastName,
      organizationName,
      gender,
      email,
      birthday,
    } = userData;

    let organization: OrganizationEntity | null = null;
    if (bin) {
      organization = await this.organizationService.findOne({
        where: { bin },
      });

      if (!organization) {
        organization = await this.organizationService.createOne({
          bin: bin,
          name: organizationName || `Тестовая организация ${bin}`,
        });
      }
    }

    let user = await this.userService.findOne({ where: { iin } });

    if (!user) {
      user = await this.userService.createOne({
        iin: iin,
        firstName: firstName || 'Тест',
        lastName: lastName || 'Ботович',
        gender: gender || UserGender.MALE,
        birthday: birthday || '1990-01-01',
        email: email || `bot_${iin}@test.com`,
        role: bin ? UserRoles.ADMIN : UserRoles.USER,
        organization: organization ? organization : undefined,
      });
    }

    return await this.tokenService.generateTokens({
      id: (user as UserEntity).id,
      role: (user as UserEntity).role,
    });
  }
}
