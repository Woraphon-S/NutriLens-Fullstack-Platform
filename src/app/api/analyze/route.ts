import { NextRequest, NextResponse } from 'next/server';
import { GeminiClient } from '@/infrastructure/ai/gemini.client';
import { FileStore } from '@/infrastructure/storage/file.store';
import { MealService } from '@/domain/meals/meal.service';
import type { ApiResponse, AnalysisResult } from '@/shared/types';

import { PgMealRepository } from '@/infrastructure/database/repositories/PgMealRepository';
import { PgProgressionRepository } from '@/infrastructure/database/repositories/PgProgressionRepository';
import { StreakService } from '@/domain/user/streak.service';
import { AuthService } from '@/domain/user/auth.service';

const gemini = new GeminiClient();
const fileStore = new FileStore();
const mealRepository = new PgMealRepository();
const progressionRepository = new PgProgressionRepository();

const mealService = new MealService(gemini, mealRepository);
const streakService = new StreakService(progressionRepository);

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    // 1. Auth Check (Optional - if provided)
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const decoded = token ? AuthService.verifyToken(token) : null;
    const userId = decoded?.userId;
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'กรุณาอัปโหลดรูปภาพอาหาร' },
        { status: 400 }
      );
    }

    // 2. Image Processing & Analysis
    const buffer = Buffer.from(await file.arrayBuffer());
    const saveResult = await fileStore.saveImage(buffer, file.name, file.type);
    const imagePath = saveResult.ok ? saveResult.data : '/placeholder.png';

    if (userId) {
      // Member Flow
      const result = await mealService.analyzeAndSave(buffer, userId, imagePath);
      if (!result.ok) {
        return NextResponse.json({ success: false, error: result.error }, { status: 500 });
      }

      // Update Progression (XP/Streak)
      const progResult = await streakService.recordMealEntry(userId);
      
      return NextResponse.json({
        success: true,
        data: {
          ...result.data.analysis,
          meal: result.data.meal,
          progression: progResult.ok ? progResult.data : null
        },
      });
    } else {
      // Guest Flow
      const result = await mealService.analyzeForGuest(buffer);
      if (!result.ok) {
        return NextResponse.json({ success: false, error: result.error }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        data: { ...result.data, imagePath },
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดภายในระบบ';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
