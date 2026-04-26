import { NextRequest, NextResponse } from 'next/server';
import { PgMealRepository } from '@/infrastructure/database/repositories/PgMealRepository';
import { MealService } from '@/domain/meals/meal.service';
import { AuthService } from '@/domain/user/auth.service';
import { GeminiClient } from '@/infrastructure/ai/gemini.client';

const mealRepository = new PgMealRepository();
const gemini = new GeminiClient(); // Needed just for service constructor
const mealService = new MealService(gemini, mealRepository);

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const decoded = token ? AuthService.verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ success: false, error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await mealService.getHistory(decoded.userId, limit);

    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
