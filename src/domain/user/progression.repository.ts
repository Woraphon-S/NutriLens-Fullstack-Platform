import { UserProgression } from '@/shared/types';

export interface ProgressionRepository {
  findByUserId(userId: string): Promise<UserProgression | null>;
  upsert(progression: UserProgression): Promise<void>;
  addXp(userId: string, xp: number): Promise<UserProgression>;
  updateStreak(userId: string): Promise<UserProgression>;
}
