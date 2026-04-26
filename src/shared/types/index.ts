// ==========================================
// NutriLens AI — Core Type Definitions
// ==========================================

// --- Result Pattern ---
export type Result<T, E = string> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export function success<T>(data: T): Result<T> {
  return { ok: true, data };
}

export function failure<E = string>(error: E): Result<never, E> {
  return { ok: false, error };
}

// --- User ---
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  createdAt: Date;
}

export interface UserProgression {
  userId: string;
  currentStreak: number;
  maxStreak: number;
  totalXp: number;
  currentLevel: number;
  lastLoginAt: Date | null;
}

export interface PublicProfile {
  displayName: string;
  currentStreak: number;
  maxStreak: number;
  totalXp: number;
  currentLevel: number;
  xpToNextLevel: number;
}

// --- Meal ---
export interface Meal {
  id: string;
  userId: string | null;
  imagePath: string;
  mealName: string;
  totalCalories: number;
  analyzedAt: Date;
}

export interface MealIngredient {
  id?: number;
  mealId: string;
  name: string;
  estimatedWeightG: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

// --- AI Analysis ---
export interface AnalysisResult {
  mealName: string;
  ingredients: AnalyzedIngredient[];
  totalCalories: number;
  macros: Macros;
  healthTip: string;
}

export interface AnalyzedIngredient {
  name: string;
  estimatedWeightG: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// --- Auth ---
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  displayName: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

// --- API Responses ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
