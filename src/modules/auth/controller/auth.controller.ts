import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenResponseDto } from '../dtos/token-response.dto';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { LoginCodeDto } from '../dtos/login-code.dto';
import { CodeMessageDto } from '../dtos/code-message.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  @ApiOperation({ summary: 'User registration via email/password' })
  @ApiResponse({
    status: 201,
    type: TokenResponseDto,
  })
  async register(@Body() body: RegisterUserDto): Promise<TokenResponseDto> {
    return await this.authService.registerUser(body);
  }

  @Post('login')
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
  async login(@Body() body: LoginCodeDto): Promise<TokenResponseDto> {
    return await this.authService.loginUser(body);
  }

  @Post('code')
  @ApiOperation({
    summary: 'Get code using email ',
    description: 'User enters email to receive 4 digit code',
  })
  @HttpCode(200)
  @ApiResponse({ status: 200, type: CodeMessageDto })
  async sendCode(@Body() body: LoginUserDto): Promise<CodeMessageDto> {
    return await this.authService.sendCode(body);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user tokens (for dev environment)',
  })
  @ApiResponse({
    status: 200,
    type: TokenResponseDto,
  })
  async getTokens(@Param('id') id: number): Promise<TokenResponseDto> {
    return await this.authService.getTokensForDev(id);
  }
}
