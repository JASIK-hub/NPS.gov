import { Request } from 'express';
import { UserRoles } from 'src/modules/user/enums/user-roles.enum';
import { PayloadUser } from './payload';

export interface AuthRequest extends Request {
  user: PayloadUser;
}
