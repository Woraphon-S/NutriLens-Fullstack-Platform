import { Meal, MealIngredient, AnalysisResult } from '@/shared/types';

export interface MealRepository {
  create(userId: string, imagePath: string, analysis: AnalysisResult): Promise<Meal>;
  findByUserId(userId: string, limit?: number): Promise<Meal[]>;
  getIngredientsByMealId(mealId: string): Promise<MealIngredient[]>;
}
