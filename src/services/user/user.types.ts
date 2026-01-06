import { User } from '@prisma/client';
import { RoleField } from './user.services';

export type UserDBWithRole = User & { role: RoleField['role'] };
