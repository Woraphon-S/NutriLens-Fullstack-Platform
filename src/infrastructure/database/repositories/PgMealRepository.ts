import { Pool } from 'pg';
import { pool } from '../db';
import { MealRepository } from '@/domain/meals/meal.repository';
import { Meal, MealIngredient, AnalysisResult } from '@/shared/types';

export class PgMealRepository implements MealRepository {
  private db: Pool = pool;

  async create(userId: string, imagePath: string, analysis: AnalysisResult): Promise<Meal> {
    const client = await this.db.connect();
    try {
      await client.query('BEGIN');

      // 1. Insert Meal
      const mealRes = await client.query(
        `INSERT INTO meals (user_id, image_path, meal_name, total_calories)
         VALUES ($1, $2, $3, $4)
         RETURNING id, user_id as "userId", image_path as "imagePath", meal_name as "mealName", total_calories as "totalCalories", analyzed_at as "analyzedAt"`,
        [userId, imagePath, analysis.mealName, analysis.totalCalories]
      );

      const meal = mealRes.rows[0];

      // 2. Insert Ingredients
      for (const ing of analysis.ingredients) {
        await client.query(
          `INSERT INTO meal_ingredients (meal_id, name, estimated_weight_g, calories, protein, carbs, fat)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [meal.id, ing.name, ing.estimatedWeightG, ing.calories, ing.protein, ing.carbs, ing.fat]
        );
      }

      await client.query('COMMIT');
      return meal;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findByUserId(userId: string, limit: number = 20): Promise<any[]> {
    const res = await this.db.query(
      `SELECT 
        m.id, 
        m.user_id as "userId", 
        m.image_path as "imagePath", 
        m.meal_name as "mealName", 
        m.total_calories as "totalCalories", 
        m.analyzed_at as "analyzedAt",
        json_build_object(
          'protein', COALESCE(SUM(i.protein), 0),
          'carbs', COALESCE(SUM(i.carbs), 0),
          'fat', COALESCE(SUM(i.fat), 0)
        ) as "macros",
        COALESCE(json_agg(
          json_build_object(
            'name', i.name,
            'calories', i.calories,
            'protein', i.protein,
            'carbs', i.carbs,
            'fat', i.fat,
            'estimatedWeightG', i.estimated_weight_g
          )
        ) FILTER (WHERE i.id IS NOT NULL), '[]') as "ingredients"
       FROM meals m
       LEFT JOIN meal_ingredients i ON m.id = i.meal_id
       WHERE m.user_id = $1
       GROUP BY m.id
       ORDER BY m.analyzed_at DESC 
       LIMIT $2`,
      [userId, limit]
    );
    return res.rows;
  }

  async getIngredientsByMealId(mealId: string): Promise<MealIngredient[]> {
    const res = await this.db.query(
      `SELECT id, meal_id as "mealId", name, estimated_weight_g as "estimatedWeightG", calories, protein, carbs, fat
       FROM meal_ingredients WHERE meal_id = $1`,
      [mealId]
    );
    return res.rows;
  }
}
