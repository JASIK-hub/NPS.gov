import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenResponseDto } from '../dtos/token-response.dto';
import { AuthService } from '../services/auth.service';
import { Public } from 'src/core/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthDevController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get user tokens (for dev environment)',
  })
  @ApiResponse({
    status: 200,
    type: TokenResponseDto,
  })
  async getTokens(@Param('id') id: number): Promise<TokenResponseDto> {
    return this.authService.getTokensForDev(id);
  }
}
