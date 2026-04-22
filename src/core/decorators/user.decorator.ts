import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PayloadUser } from '../types/payload';

export const CurrentUser = createParamDecorator(
  (data: keyof any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user: PayloadUser = req.user;
    return data ? user[data] : user;
  },
);
