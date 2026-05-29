import { NextRequest, NextResponse } from 'next/server';
import { PgProgressionRepository } from '@/infrastructure/database/repositories/PgProgressionRepository';
import { StreakService } from '@/domain/user/streak.service';
import { AuthService } from '@/domain/user/auth.service';

const progressionRepository = new PgProgressionRepository();
const streakService = new StreakService(progressionRepository);

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const decoded = token ? AuthService.verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ success: false, error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }

    const result = await streakService.getSummary(decoded.userId);

    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
