import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { TokenService } from 'src/modules/auth/services/token.service';
import { AuthRequest } from '../types/auth.request';
import { PayloadToken } from '../types/payload';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private tokenService: TokenService) {}
  async use(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const payload: PayloadToken =
          await this.tokenService.validateToken(token);
        req.user = {
          id: Number(payload.sub),
          role: payload.role,
        };
        next();
      } catch (error) {
        throw new UnauthorizedException('Invalid Token');
      }
    }
  }
}
