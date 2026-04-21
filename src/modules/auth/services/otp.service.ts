import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ENV_KEYS } from 'src/core/config/env-keys';
import { TokenService } from './token.service';

@Injectable()
export class OtpService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('redis') private readonly redis: Redis,
    private tokenService: TokenService,
  ) {}

  async generateCode(email: string): Promise<string> {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const codeExp = this.configService.get<string>(
      ENV_KEYS.AUTH_CODE_EXPIRATION,
    );
    if (!codeExp) {
      throw new Error('Code expiration config is missing');
    }
    const codeTtl = this.tokenService.parseToSeconds(codeExp);
    await this.redis.set(`auth_code:${email}`, code, 'EX', codeTtl);
    return code;
  }

  async verifyCode(code: string, email: string): Promise<boolean> {
    const storedCode = await this.redis.get(`auth_code:${email}`);
    if (!storedCode) {
      throw new Error('Code expired or not found');
    }
    if (storedCode !== code) {
      return false;
    }
    await this.redis.del(`auth_code:${email}`);
    return true;
  }
}
