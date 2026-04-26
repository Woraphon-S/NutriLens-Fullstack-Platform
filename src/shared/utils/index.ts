import { type Macros } from '@/shared/types';

export const XP_PER_MEAL = 25;
export const XP_STREAK_BONUS = 10;
export const XP_PER_LEVEL = 100;
export const MAX_FILE_SIZE_MB = 10;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function calculateLevel(totalXp: number): number {
  return Math.floor(totalXp / XP_PER_LEVEL) + 1;
}

export function xpToNextLevel(totalXp: number): number {
  return XP_PER_LEVEL - (totalXp % XP_PER_LEVEL);
}

export function formatCalories(cal: number): string {
  return `${Math.round(cal)} แคล`;
}

export function formatWeight(grams: number): string {
  return `${Math.round(grams)} กรัม`;
}

export function formatMacroPercent(macros: Macros): {
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
} {
  const total = macros.protein + macros.carbs + macros.fat;
  if (total === 0) return { proteinPct: 0, carbsPct: 0, fatPct: 0 };
  return {
    proteinPct: Math.round((macros.protein / total) * 100),
    carbsPct: Math.round((macros.carbs / total) * 100),
    fatPct: Math.round((macros.fat / total) * 100),
  };
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 30) return '🏆';
  if (streak >= 14) return '🔥';
  if (streak >= 7) return '⭐';
  if (streak >= 3) return '💪';
  return '🌱';
}

export function getLevelTitle(level: number): string {
  if (level >= 20) return 'นักโภชนาการระดับมาสเตอร์';
  if (level >= 15) return 'ผู้เชี่ยวชาญด้านสุขภาพ';
  if (level >= 10) return 'นักวิเคราะห์อาหาร';
  if (level >= 5) return 'ผู้ดูแลสุขภาพ';
  return 'มือใหม่รักสุขภาพ';
}

export function isValidImageType(mimeType: string): boolean {
  return ALLOWED_IMAGE_TYPES.includes(mimeType);
}

export function isValidFileSize(sizeBytes: number): boolean {
  return sizeBytes <= MAX_FILE_SIZE_MB * 1024 * 1024;
}

export function generateMealId(): string {
  return crypto.randomUUID();
}

export function formatThaiDate(date: Date): string {
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
