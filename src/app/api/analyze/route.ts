import { NextRequest, NextResponse } from 'next/server';
import { GeminiClient } from '@/infrastructure/ai/gemini.client';
import { FileStore } from '@/infrastructure/storage/file.store';
import { MealService } from '@/domain/meals/meal.service';
import type { ApiResponse } from '@/shared/types';
import { isValidImageType, isValidFileSize } from '@/shared/utils';

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

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<unknown>>> {
  try {
    // 1. Auth Check (Optional - if provided)
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const decoded = token ? AuthService.verifyToken(token) : null;
    const userId = decoded?.userId;

    // Parse multipart body — reject anything that isn't a proper form upload
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, error: 'กรุณาอัปโหลดรูปภาพอาหาร' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'กรุณาอัปโหลดรูปภาพอาหาร' },
        { status: 400 }
      );
    }

    // 2. Validate file type & size (friendly errors, before touching the AI)
    if (!isValidImageType(file.type)) {
      return NextResponse.json(
        { success: false, error: 'รองรับเฉพาะไฟล์ JPEG, PNG หรือ WebP' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!isValidFileSize(buffer.length)) {
      return NextResponse.json(
        { success: false, error: 'ขนาดไฟล์เกิน 10MB' },
        { status: 400 }
      );
    }

    if (userId) {
      // Member Flow — persist the image to disk so it can be shown in history
      const saveResult = await fileStore.saveImage(buffer, file.name, file.type);
      if (!saveResult.ok) {
        return NextResponse.json({ success: false, error: saveResult.error }, { status: 400 });
      }
      const imagePath = saveResult.data;

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
      // Guest Flow — analyze only, no disk write or DB persistence
      // (the client previews the image from a local object URL, so we never
      //  need to store guest uploads on the server)
      const result = await mealService.analyzeForGuest(buffer);
      if (!result.ok) {
        return NextResponse.json({ success: false, error: result.error }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        data: result.data,
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
