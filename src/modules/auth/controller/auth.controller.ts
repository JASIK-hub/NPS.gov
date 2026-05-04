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
  async sendCode(@Body() body: LoginEmailDto): Promise<CodeMessageDto> {
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
}
