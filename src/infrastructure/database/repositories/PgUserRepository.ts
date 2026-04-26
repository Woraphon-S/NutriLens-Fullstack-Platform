import { Pool } from 'pg';
import { pool } from '../db';
import { UserRepository } from '@/domain/user/user.repository';
import { User, RegisterPayload } from '@/shared/types';

export class PgUserRepository implements UserRepository {
  private db: Pool = pool;

  async findById(id: string): Promise<User | null> {
    const res = await this.db.query(
      'SELECT id, email, password_hash as "passwordHash", display_name as "displayName", created_at as "createdAt" FROM users WHERE id = $1',
      [id]
    );
    return res.rows[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const res = await this.db.query(
      'SELECT id, email, password_hash as "passwordHash", display_name as "displayName", created_at as "createdAt" FROM users WHERE email = $1',
      [email]
    );
    return res.rows[0] || null;
  }

  async create(payload: RegisterPayload & { passwordHash: string }): Promise<User> {
    const res = await this.db.query(
      'INSERT INTO users (email, password_hash, display_name) VALUES ($1, $2, $3) RETURNING id, email, password_hash as "passwordHash", display_name as "displayName", created_at as "createdAt"',
      [payload.email, payload.passwordHash, payload.displayName]
    );
    
    // Create initial progression for the user
    await this.db.query(
      'INSERT INTO user_progression (user_id) VALUES ($1)',
      [res.rows[0].id]
    );

    return res.rows[0];
  }
}
