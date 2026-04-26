import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { ENV_KEYS } from 'src/core/config/env-keys';
import { TokenResponseDto } from '../dtos/token-response.dto';
import { AccessPayload, JwtUser, RefreshPayload } from '../types/auth.types';

@Injectable()
export class TokenService {
  constructor(
    @Inject('redis') private readonly redis: Redis,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async generateTokens(user: JwtUser): Promise<TokenResponseDto> {
    const accessPayload: AccessPayload = {
      sub: user.id,
      role: user.role,
      type: 'access',
    };
    const refreshPayload: RefreshPayload = {
      sub: user.id,
      type: 'refresh',
    };

    const accessExpiration = this.configService.get<string>(
      ENV_KEYS.JWT_ACCESS_TOKEN_EXPIRATION,
    );
    const refreshExpiration = this.configService.get<string>(
      ENV_KEYS.JWT_REFRESH_TOKEN_EXPIRATION,
    );
    if (!accessExpiration || !refreshExpiration) {
      throw new Error('JWT expiration config is missing');
    }
    const accessTtl = this.parseToSeconds(accessExpiration);
    const refreshTtl = this.parseToSeconds(refreshExpiration);

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      expiresIn: accessTtl,
    });
    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      expiresIn: refreshTtl,
    });
    await this.setRefreshToRedis(user.id, refreshToken, refreshTtl);
    return { accessToken, refreshToken };
  }

  async logOutSession(token: string, userId: number): Promise<void> {
    const decoded = this.jwtService.decode(token) as any;
    const now = Math.floor(Date.now() / 1000);
    const ttl = decoded.exp - now;

    if (ttl > 0) {
      await this.setTokenToBlackList(token, ttl);
    }
    const key = `refresh_token:${userId}`;
    await this.redis.del(key);
  }

  private async setTokenToBlackList(token: string, ttl: number) {
    await this.redis.set(`blackList:${token}`, 'true', 'EX', ttl);
  }

  async validateToken(token: string) {
    const isRevoked = await this.redis.get(`blackList:${token}`);

    if (isRevoked) {
      throw new UnauthorizedException('Token has been revoked');
    }

    try {
      const decoded = await this.jwtService.verify(token);

      if (decoded.type !== 'access') {
        throw new UnauthorizedException('Invalid token type');
      }

      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
    }
  }

  private async setRefreshToRedis(
    sub: number,
    refreshToken: string,
    refreshTtl: number,
  ): Promise<void> {
    await this.redis.set(
      `refresh_token:${sub}`,
      refreshToken,
      'EX',
      refreshTtl,
    );
  }

  parseToSeconds(value: string): number {
    const match = value.match(/^(\d+)([smhd])$/);

    if (!match) {
      throw new Error(`Invalid expiration format: ${value}`);
    }

    const amount = Number(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's':
        return amount;
      case 'm':
        return amount * 60;
      case 'h':
        return amount * 60 * 60;
      case 'd':
        return amount * 60 * 60 * 24;
      default:
        throw new Error(`Unsupported time unit: ${unit}`);
    }
  }
}
