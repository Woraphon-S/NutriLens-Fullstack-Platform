import { User, RegisterPayload } from '@/shared/types';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(payload: RegisterPayload & { passwordHash: string }): Promise<User>;
}
