import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TokenResponseDto } from '../dtos/token-response.dto';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginEmailDto, LoginPasswordDto } from '../dtos/login-user.dto';
import { LoginCodeDto } from '../dtos/login-code.dto';
import { CodeMessageDto } from '../dtos/code-message.dto';
import { LoginEcpDto } from '../dtos/login-ecp.dto';
import { CurrentUser } from 'src/core/decorators/user.decorator';
import { Public } from 'src/core/decorators/public.decorator';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from '../dtos/forgot-password.dto';
import { VerifyEmailDto, VerifyEmailWithPasswordDto } from '../dtos/verify-email.dto';
import { SendCodeDto } from '../dtos/send-code.dto';
import { CompleteRegistrationDto } from '../dtos/complete-registration.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('registration')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    type: TokenResponseDto,
  })
  async register(@Body() body: RegisterUserDto): Promise<TokenResponseDto> {
    return this.authService.registerUser(body);
  }

  @Public()
  @Post('login/code')
  @ApiOperation({
    summary: 'User login with code',
    description: 'User logins using 4 digit code sent to mail',
  })
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    type: TokenResponseDto,
  })
  @ApiBody({ type: LoginCodeDto })
  async loginWithCode(@Body() body: LoginCodeDto): Promise<TokenResponseDto> {
    return this.authService.loginWithCode(body);
  }

  @Public()
  @Post('send-code')
  @ApiOperation({
    summary: 'Get code using email ',
    description: 'User enters email to receive 4 digit code',
  })
  @HttpCode(200)
  @ApiResponse({ status: 200, type: CodeMessageDto })
  async sendCode(@Body() body: SendCodeDto): Promise<CodeMessageDto> {
    return this.authService.sendCode(body);
  }

  @Public()
  @Post('login/password')
  @ApiOperation({
    summary: 'Login with email, password',
  })
  @HttpCode(200)
  async loginWithEmail(
    @Body() body: LoginPasswordDto,
  ): Promise<TokenResponseDto> {
    return this.authService.loginWithPassword(body);
  }

  @ApiBearerAuth('Authorization')
  @Post('log-out')
  @ApiOperation({
    summary: 'LogOut from session',
  })
  @HttpCode(200)
  async logOut(
    @Req() req: any,
    @CurrentUser('id') userId: number,
  ): Promise<void> {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    await this.authService.logOut(token, userId);
  }

  @Public()
  @Post('login/ecp')
  @ApiOperation({
    summary: 'Login using ECP',
  })
  @ApiResponse({
    status: 200,
    type: TokenResponseDto,
  })
  async loginWithEcp(@Body() body: LoginEcpDto) {
    return this.authService.loginWithEcp(body);
  }

  @Public()
  @Post('refresh-token')
  @ApiOperation({
    summary: 'refresh token',
  })
  @HttpCode(200)
  async refreshToken(@Body() body: RefreshTokenDto): Promise<TokenResponseDto> {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({
    summary: 'Отправить код для сброса пароля',
    description: 'Отправляет 4-значный код на email пользователя',
  })
  @HttpCode(200)
  @ApiResponse({ status: 200, type: CodeMessageDto })
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<CodeMessageDto> {
    return this.authService.sendPasswordResetCode(body.email);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({
    summary: 'Сбросить пароль с кодом',
    description: 'Устанавливает новый пароль после подтверждения кода из email',
  })
  @HttpCode(200)
  @ApiResponse({ status: 200, type: CodeMessageDto })
  async resetPassword(@Body() body: ResetPasswordDto): Promise<CodeMessageDto> {
    return this.authService.resetPassword(body.email, body.code, body.newPassword);
  }

  @ApiBearerAuth('Authorization')
  @Post('change-password')
  @ApiOperation({
    summary: 'Изменить пароль',
    description: 'Изменяет пароль для авторизованного пользователя',
  })
  @HttpCode(200)
  @ApiResponse({ status: 200, type: CodeMessageDto })
  async changePassword(
    @Body() body: ChangePasswordDto,
    @CurrentUser('id') userId: number,
  ): Promise<CodeMessageDto> {
    return this.authService.changePassword(userId, body.currentPassword, body.newPassword);
  }

  @ApiBearerAuth('Authorization')
  @Get('me')
  @ApiOperation({
    summary: 'Получить данные текущего пользователя',
    description: 'Возвращает информацию о текущем авторизованном пользователе',
  })
  @ApiResponse({ status: 200, type: Object })
  async getProfile(@CurrentUser('id') userId: number) {
    return this.authService.getProfile(userId);
  }

  @ApiBearerAuth('Authorization')
  @Post('verify-email/send')
  @ApiOperation({
    summary: 'Отправить код подтверждения email',
    description: 'Отправляет 4-значный код на указанный email для привязки к аккаунту',
  })
  @HttpCode(200)
  @ApiResponse({ status: 200, type: CodeMessageDto })
  async sendVerifyEmail(
    @Body() body: VerifyEmailDto,
    @CurrentUser('id') userId: number,
  ): Promise<CodeMessageDto> {
    return this.authService.sendEmailVerification(userId, body.email);
  }

  @ApiBearerAuth('Authorization')
  @Post('verify-email/confirm')
  @ApiOperation({
    summary: 'Подтвердить email и установить пароль',
    description: 'Подтверждает email кодом и опционально устанавливает пароль',
  })
  @HttpCode(200)
  @ApiResponse({ status: 200, type: TokenResponseDto })
  async verifyEmail(
    @Body() body: VerifyEmailWithPasswordDto,
    @CurrentUser('id') userId: number,
  ): Promise<TokenResponseDto> {
    return this.authService.verifyEmailWithPassword(userId, body.email, body.code, body.password);
  }

  @Public()
  @Post('register/complete')
  @ApiOperation({
    summary: 'Завершить регистрацию',
    description: 'Завершает регистрацию после подтверждения кода. Создает пользователя и возвращает токены.',
  })
  @HttpCode(201)
  @ApiResponse({ status: 201, type: TokenResponseDto })
  async completeRegistration(@Body() body: CompleteRegistrationDto): Promise<TokenResponseDto> {
    return this.authService.completeRegistration(body);
  }
}
