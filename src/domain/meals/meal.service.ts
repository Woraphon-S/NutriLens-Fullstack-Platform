import {
  type AnalysisResult,
  type Meal,
  type MealIngredient,
  type Result,
  success,
  failure,
} from '@/shared/types';
import { MealRepository } from './meal.repository';

// AI Analyzer interface — wraps Gemini client
export interface NutritionAnalyzer {
  analyzeImage(imageBuffer: Buffer): Promise<Result<AnalysisResult>>;
}

export class MealService {
  constructor(
    private analyzer: NutritionAnalyzer,
    private repository: MealRepository
  ) {}

  async analyzeForGuest(imageBuffer: Buffer): Promise<Result<AnalysisResult>> {
    const result = await this.analyzer.analyzeImage(imageBuffer);
    if (!result.ok) return failure(`วิเคราะห์ภาพไม่สำเร็จ: ${result.error}`);
    return success(result.data);
  }

  async analyzeAndSave(
    imageBuffer: Buffer,
    userId: string,
    imagePath: string
  ): Promise<Result<{ meal: Meal; analysis: AnalysisResult }>> {
    try {
      const analysisResult = await this.analyzer.analyzeImage(imageBuffer);
      if (!analysisResult.ok) {
        return failure(`วิเคราะห์ภาพไม่สำเร็จ: ${analysisResult.error}`);
      }

      const analysis = analysisResult.data;
      const meal = await this.repository.create(userId, imagePath, analysis);

      return success({ meal, analysis });
    } catch (error) {
      console.error('Analyze and save error:', error);
      return failure('เกิดข้อผิดพลาดในการบันทึกข้อมูลมื้ออาหาร');
    }
  }

  async getHistory(
    userId: string,
    limit = 20
  ): Promise<Result<Meal[]>> {
    try {
      const meals = await this.repository.findByUserId(userId, limit);
      return success(meals);
    } catch (error) {
      return failure('ไม่สามารถดึงข้อมูลประวัติได้');
    }
  }

  async getMealDetail(
    mealId: string
  ): Promise<Result<{ meal: Meal; ingredients: MealIngredient[] } | null>> {
    try {
      // Note: We need a findById in Repo if we want details for a specific ID
      // For now, these details are usually fetched in a list or specific UI
      // I will assume findById exists or implement it if needed.
      return failure('Not implemented yet');
    } catch (error) {
      return failure('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
  }
}
