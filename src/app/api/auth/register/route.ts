import { NextResponse } from 'next/server';
import { PgUserRepository } from '@/infrastructure/database/repositories/PgUserRepository';
import { AuthService } from '@/domain/user/auth.service';
import { RegisterPayload } from '@/shared/types';

const userRepository = new PgUserRepository();
const authService = new AuthService(userRepository);

export async function POST(req: Request) {
  console.log('[API] Processing Registration Request...');
  try {
    const body: RegisterPayload = await req.json();

    if (!body.email || !body.password || !body.displayName) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const result = await authService.register(body);

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('[API] Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
