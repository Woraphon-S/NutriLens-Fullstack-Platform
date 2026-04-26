import { Pool } from 'pg';
import { pool } from '../db';
import { ProgressionRepository } from '@/domain/user/progression.repository';
import { UserProgression } from '@/shared/types';

export class PgProgressionRepository implements ProgressionRepository {
  private db: Pool = pool;

  async findByUserId(userId: string): Promise<UserProgression | null> {
    const res = await this.db.query(
      'SELECT user_id as "userId", current_streak as "currentStreak", max_streak as "maxStreak", total_xp as "totalXp", current_level as "currentLevel", last_login_at as "lastLoginAt" FROM user_progression WHERE user_id = $1',
      [userId]
    );
    return res.rows[0] || null;
  }

  async upsert(prog: UserProgression): Promise<void> {
    await this.db.query(
      `INSERT INTO user_progression (user_id, current_streak, max_streak, total_xp, current_level, last_login_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id) DO UPDATE SET
       current_streak = EXCLUDED.current_streak,
       max_streak = EXCLUDED.max_streak,
       total_xp = EXCLUDED.total_xp,
       current_level = EXCLUDED.current_level,
       last_login_at = EXCLUDED.last_login_at`,
      [prog.userId, prog.currentStreak, prog.maxStreak, prog.totalXp, prog.currentLevel, prog.lastLoginAt]
    );
  }

  async addXp(userId: string, xp: number): Promise<UserProgression> {
    // Logic for level up is usually in the service, but here we just update DB
    const res = await this.db.query(
      'UPDATE user_progression SET total_xp = total_xp + $1 WHERE user_id = $2 RETURNING *',
      [xp, userId]
    );
    const row = res.rows[0];
    return {
      userId: row.user_id,
      currentStreak: row.current_streak,
      maxStreak: row.max_streak,
      totalXp: row.total_xp,
      currentLevel: row.current_level,
      lastLoginAt: row.last_login_at
    };
  }

  async updateStreak(userId: string): Promise<UserProgression> {
    // This is better handled in StreakService, but here's a basic DB op
    const res = await this.db.query(
      'UPDATE user_progression SET current_streak = current_streak + 1, last_login_at = NOW() WHERE user_id = $1 RETURNING *',
      [userId]
    );
    const row = res.rows[0];
    return {
      userId: row.user_id,
      currentStreak: row.current_streak,
      maxStreak: row.max_streak,
      totalXp: row.total_xp,
      currentLevel: row.current_level,
      lastLoginAt: row.last_login_at
    };
  }
}
