import { UserRoles } from 'src/modules/user/enums/user-roles.enum';

export type PayloadUser = {
  id: number;
  role: UserRoles;
};

export type PayloadToken = {
  sub: string;
  role: UserRoles;
  type: 'access' | 'refresh';
};
