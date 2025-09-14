import { z } from "zod";

// User role enum
export const UserRole = {
  USER: "user",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// User schema for validation
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().max(255),
  username: z.string().min(3).max(50),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  avatar: z.string().url().optional(),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
  isActive: z.boolean().default(true),
  emailVerified: z.boolean().default(false),
  lastLoginAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// User session schema
export const UserSessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  tokenHash: z.string(),
  expiresAt: z.date(),
  isActive: z.boolean().default(true),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  createdAt: z.date(),
});

// Auth request schemas
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
});

export const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export const UpdateProfileRequestSchema = z.object({
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  avatar: z.string().url().optional(),
});

// Auth response schemas
export const AuthResponseSchema = z.object({
  user: UserSchema,
  tokens: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresAt: z.date(),
  }),
});

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

// Type exports
export type User = z.infer<typeof UserSchema>;
export type UserWithPassword = User & { passwordHash: string };
export type UserSession = z.infer<typeof UserSessionSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginCredentials = LoginRequest; // Alias for consistency
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type RegisterData = RegisterRequest; // Alias for consistency
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
};
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

// Database insert types (without generated fields)
export type CreateUser = Omit<
  User,
  "id" | "createdAt" | "updatedAt" | "lastLoginAt"
> & {
  passwordHash: string;
};

export type CreateUserSession = Omit<UserSession, "id" | "createdAt">;

// Update types
export type UpdateUser = Partial<
  Pick<
    User,
    | "firstName"
    | "lastName"
    | "avatar"
    | "role"
    | "isActive"
    | "emailVerified"
    | "lastLoginAt"
  >
> & {
  passwordHash?: string;
};

export type UpdateUserSession = Partial<
  Pick<UserSession, "isActive" | "expiresAt">
>;
