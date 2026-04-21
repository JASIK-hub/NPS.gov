import { UserRoles } from 'src/modules/user/enums/user-roles.enum';

export type JwtUser = {
  id: number;
  role?: UserRoles | undefined;
};

export interface AccessPayload {
  sub: number;
  role: UserRoles | undefined;
  type: 'access';
}

export interface RefreshPayload {
  sub: number;
  type: 'refresh';
}
