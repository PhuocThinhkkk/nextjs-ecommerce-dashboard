import { isValidRole } from '@/services/user/user.services';
import { RoleField } from '@/services/user/user.services';

export type UserUpdateIntent = {
  db?: {
    name?: string;
  };
  clerk?: {
    role?: RoleField['role'];
  };
};

export class UserUpdateBuilder {
  private intent: UserUpdateIntent = {};

  setName(name: unknown) {
    if (typeof name === 'string') {
      this.intent.db ??= {};
      this.intent.db.name = name;
    }
    return this;
  }

  setRole(role: unknown) {
    if (role == null) return this;

    if (typeof role !== 'string') {
      throw new Error('Invalid role type');
    }

    if (!isValidRole(role)) {
      throw new Error('Invalid role');
    }

    this.intent.clerk ??= {};
    this.intent.clerk.role = role;

    return this;
  }

  build() {
    if (!this.intent.db && !this.intent.clerk) {
      throw new Error('No fields to update');
    }

    return this.intent;
  }
}
