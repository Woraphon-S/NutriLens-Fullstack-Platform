import {
  type UserProgression,
  type Result,
  success,
  failure,
} from '@/shared/types';
import {
  XP_PER_MEAL,
  XP_STREAK_BONUS,
  calculateLevel,
} from '@/shared/utils';
import { ProgressionRepository } from './progression.repository';

export class StreakService {
  constructor(private repository: ProgressionRepository) {}

  calculateUpdatedProgression(
    current: UserProgression | null,
    now: Date
  ): UserProgression {
    if (!current) {
      const fresh: UserProgression = {
        userId: '',
        currentStreak: 1,
        maxStreak: 1,
        totalXp: XP_PER_MEAL,
        currentLevel: 1,
        lastLoginAt: now,
      };
      return fresh;
    }

    const lastDate = current.lastLoginAt ? new Date(current.lastLoginAt) : null;
    let newStreak = current.currentStreak;
    let bonusXp = 0;

    if (lastDate) {
      const diffMs = now.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day — streak stays, only meal XP
        const totalXp = current.totalXp + XP_PER_MEAL;
        return {
          ...current,
          totalXp,
          currentLevel: calculateLevel(totalXp),
          lastLoginAt: now,
        };
      } else if (diffDays === 1) {
        // Consecutive day — streak increments
        newStreak = current.currentStreak + 1;
        bonusXp = XP_STREAK_BONUS;
      } else {
        // Streak broken
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const newMaxStreak = Math.max(current.maxStreak, newStreak);
    const totalXp = current.totalXp + XP_PER_MEAL + bonusXp;

    return {
      userId: current.userId,
      currentStreak: newStreak,
      maxStreak: newMaxStreak,
      totalXp,
      currentLevel: calculateLevel(totalXp),
      lastLoginAt: now,
    };
  }

  async recordMealEntry(userId: string): Promise<Result<UserProgression>> {
    try {
      const current = await this.repository.findByUserId(userId);
      const updated = this.calculateUpdatedProgression(current, new Date());
      updated.userId = userId;

      await this.repository.upsert(updated);
      return success(updated);
    } catch (error) {
      console.error('Record meal entry error:', error);
      return failure('ไม่สามารถอัปเดตข้อมูลระดับและความก้าวหน้าได้');
    }
  }

  async getSummary(userId: string): Promise<Result<UserProgression | null>> {
    try {
      const res = await this.repository.findByUserId(userId);
      return success(res);
    } catch (error) {
      return failure('ไม่สามารถดึงข้อมูลสรุปได้');
    }
  }
}
