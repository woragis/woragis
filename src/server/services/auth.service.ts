import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AuthRepository } from "../repositories";
import type {
  CreateUser,
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
  AuthResponse,
  User,
  UserSession,
  UserRole,
} from "../../types";

export class AuthService {
  private authRepository: AuthRepository;
  private jwtSecret: string;
  private jwtExpiresIn: string;
  private refreshTokenExpiresIn: number; // in days

  constructor() {
    this.authRepository = new AuthRepository();
    this.jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1h";
    this.refreshTokenExpiresIn = parseInt(
      process.env.REFRESH_TOKEN_EXPIRES_IN || "7"
    );
  }

  // Password utilities
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  private async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // JWT utilities
  private generateAccessToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
      issuer: "portfolio-app",
      audience: "portfolio-users",
    });
  }

  private generateRefreshToken(): string {
    return crypto.randomBytes(64).toString("hex");
  }

  private async createUserSession(
    userId: string,
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<UserSession> {
    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.refreshTokenExpiresIn);

    return await this.authRepository.createSession({
      userId,
      tokenHash,
      expiresAt,
      isActive: true,
      userAgent,
      ipAddress,
    });
  }

  // Auth operations
  async register(
    userData: RegisterRequest,
    userAgent?: string,
    ipAddress?: string
  ): Promise<AuthResponse> {
    // Check if email is already taken
    const existingUserByEmail = await this.authRepository.getUserByEmail(
      userData.email
    );
    if (existingUserByEmail) {
      throw new Error("Email is already registered");
    }

    // Check if username is already taken
    const existingUserByUsername = await this.authRepository.getUserByUsername(
      userData.username
    );
    if (existingUserByUsername) {
      throw new Error("Username is already taken");
    }

    // Hash password
    const passwordHash = await this.hashPassword(userData.password);

    // Create user
    const createUserData: CreateUser = {
      email: userData.email,
      username: userData.username,
      passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: "user" as UserRole,
      isActive: true,
      emailVerified: false,
    };

    const user = await this.authRepository.createUser(createUserData);

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();

    // Create session
    const session = await this.createUserSession(
      user.id,
      refreshToken,
      userAgent,
      ipAddress
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token: accessToken,
      expiresAt: session.expiresAt,
    };
  }

  async login(
    credentials: LoginRequest,
    userAgent?: string,
    ipAddress?: string
  ): Promise<AuthResponse> {
    // Find user by email
    const user = await this.authRepository.getUserByEmail(credentials.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(
      credentials.password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Update last login
    await this.authRepository.updateUser(user.id, { lastLoginAt: new Date() });

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();

    // Create session
    const session = await this.createUserSession(
      user.id,
      refreshToken,
      userAgent,
      ipAddress
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token: accessToken,
      expiresAt: session.expiresAt,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const session = await this.authRepository.getSessionByTokenHash(tokenHash);

    if (!session || !session.isActive) {
      throw new Error("Invalid refresh token");
    }

    if (session.expiresAt < new Date()) {
      throw new Error("Refresh token has expired");
    }

    const user = await this.authRepository.getUserById(session.userId);
    if (!user || !user.isActive) {
      throw new Error("User not found or inactive");
    }

    // Generate new access token
    const accessToken = this.generateAccessToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token: accessToken,
      expiresAt: session.expiresAt,
    };
  }

  async logout(refreshToken: string): Promise<boolean> {
    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    const session = await this.authRepository.getSessionByTokenHash(tokenHash);

    if (session) {
      return await this.authRepository.deactivateSession(session.id);
    }

    return false;
  }

  async logoutAllSessions(userId: string): Promise<boolean> {
    return await this.authRepository.deactivateAllUserSessions(userId);
  }

  async changePassword(
    userId: string,
    passwordData: ChangePasswordRequest
  ): Promise<boolean> {
    const user = await this.authRepository.getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await this.verifyPassword(
      passwordData.currentPassword,
      user.passwordHash
    );
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const newPasswordHash = await this.hashPassword(passwordData.newPassword);

    // Update password
    const updatedUser = await this.authRepository.updateUser(userId, {
      passwordHash: newPasswordHash,
    });
    return updatedUser !== null;
  }

  async updateProfile(
    userId: string,
    profileData: UpdateProfileRequest
  ): Promise<User | null> {
    return await this.authRepository.updateUser(userId, profileData);
  }

  async getUserById(userId: string): Promise<User | null> {
    return await this.authRepository.getUserById(userId);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.authRepository.getUserByEmail(email);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await this.authRepository.getUserByUsername(username);
  }

  async getAllUsers(limit = 50, offset = 0): Promise<User[]> {
    return await this.authRepository.getAllUsers(limit, offset);
  }

  async getUsersCount(): Promise<number> {
    return await this.authRepository.getUsersCount();
  }

  async deactivateUser(userId: string): Promise<boolean> {
    const result = await this.authRepository.updateUser(userId, {
      isActive: false,
    });
    if (result) {
      // Deactivate all user sessions
      await this.authRepository.deactivateAllUserSessions(userId);
    }
    return result !== null;
  }

  async activateUser(userId: string): Promise<boolean> {
    const result = await this.authRepository.updateUser(userId, {
      isActive: true,
    });
    return result !== null;
  }

  async deleteUser(userId: string): Promise<boolean> {
    // Delete all user sessions first
    await this.authRepository.deleteAllUserSessions(userId);

    // Delete user
    return await this.authRepository.deleteUser(userId);
  }

  async verifyToken(
    token: string
  ): Promise<{
    userId: string;
    email: string;
    username: string;
    role: UserRole;
  } | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      return {
        userId: decoded.userId,
        email: decoded.email,
        username: decoded.username,
        role: decoded.role,
      };
    } catch (error) {
      return null;
    }
  }

  async cleanupExpiredSessions(): Promise<number> {
    return await this.authRepository.deleteExpiredSessions();
  }
}
