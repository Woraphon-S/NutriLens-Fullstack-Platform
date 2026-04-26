import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from './user.repository';
import { RegisterPayload, LoginPayload, Result, success, failure, User } from '@/shared/types';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(payload: RegisterPayload): Promise<Result<{ user: User; token: string }>> {
    console.log('[AuthService] Registering user:', payload.email);
    try {
      // Check if user exists
      const existingUser = await this.userRepository.findByEmail(payload.email);
      console.log('[AuthService] User check completed');
      if (existingUser) {
        return failure('อีเมลนี้ถูกใช้งานแล้ว');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(payload.password, salt);

      // Create user
      const user = await this.userRepository.create({
        ...payload,
        passwordHash,
      });
      console.log('[AuthService] User created in database');

      // Generate token
      const token = this.generateToken(user);

      return success({ user, token });
    } catch (error) {
      console.error('Registration error:', error);
      return failure('เกิดข้อผิดพลาดในการสมัครสมาชิก');
    }
  }

  async login(payload: LoginPayload): Promise<Result<{ user: User; token: string }>> {
    try {
      // Find user
      const user = await this.userRepository.findByEmail(payload.email);
      if (!user) {
        return failure('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }

      // Verify password
      const isValid = await bcrypt.compare(payload.password, user.passwordHash);
      if (!isValid) {
        return failure('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }

      // Generate token
      const token = this.generateToken(user);

      return success({ user, token });
    } catch (error) {
      console.error('Login error:', error);
      return failure('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    }
  }

  private generateToken(user: User): string {
    const secret = process.env.JWT_SECRET || 'fallback-secret-for-dev';
    return jwt.sign(
      { userId: user.id, email: user.email },
      secret,
      { expiresIn: '7d' }
    );
  }

  static verifyToken(token: string): { userId: string; email: string } | null {
    try {
      const secret = process.env.JWT_SECRET || 'fallback-secret-for-dev';
      return jwt.verify(token, secret) as { userId: string; email: string };
    } catch {
      return null;
    }
  }
}
