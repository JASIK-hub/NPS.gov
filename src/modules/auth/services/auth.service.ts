import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import * as bcrypt from 'bcrypt';
import { ENV_KEYS } from 'src/core/config/env-keys';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import { TokenResponseDto } from '../dtos/token-response.dto';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { LoginCodeDto } from '../dtos/login-code.dto';
import { Resend } from 'resend';
import { OtpService } from './otp.service';
import { otpEmailTemplate } from 'src/core/common/email/templates/otp-email.template';
import { CodeMessageDto } from '../dtos/code-message.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private tokenService: TokenService,
    private otpService: OtpService,
  ) {}

  async registerUser(body: RegisterUserDto): Promise<TokenResponseDto> {
    if (!body.email || !body.password) {
      throw new BadRequestException('Email and password are required');
    }
    if (body.email) {
      const existingUser = await this.userService.findOne({
        where: { email: body.email },
      });

      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }
    }
    body.password = await this.hashPassword(body.password);
    const user = await this.userService.createUser(body);
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

  async loginUser(body: LoginCodeDto): Promise<TokenResponseDto> {
    const user = await this.userService.findOne({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    const isValid = await this.otpService.verifyCode(body.code, body.email);
    if (!isValid) {
      throw new BadRequestException('Code does not match');
    }

    return await this.tokenService.generateTokens({
      id: user.id,
      role: user.role,
    });
  }

  async sendCode(body: LoginUserDto): Promise<CodeMessageDto> {
    const resendApiKey = this.configService.get<string>(
      ENV_KEYS.RESEND_API_KEY,
    );
    const code = await this.otpService.generateCode(body.email);
    const resend = new Resend(resendApiKey);
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: body.email,
      subject: 'Your 4 digit code for NPS.gov app',
      html: otpEmailTemplate(code),
    });
    if (result.error) {
      throw new InternalServerErrorException('Error while sending code');
    }
    return { message: 'code sent' };
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = Number(this.configService.get(ENV_KEYS.BCRYPT_SALT));
    return await bcrypt.hash(password, salt);
  }
}
