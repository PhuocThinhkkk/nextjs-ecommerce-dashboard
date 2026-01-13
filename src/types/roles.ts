export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN'
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export function isValidRole(value: unknown): value is Role {
  return Object.values(ROLES).includes(value as Role);
}

export const ROLE_VALUES = Object.values(ROLES) as [
  (typeof ROLES)[keyof typeof ROLES],
  ...(typeof ROLES)[keyof typeof ROLES][]
];
