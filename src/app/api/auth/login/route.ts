import { NextResponse } from 'next/server';
import { PgUserRepository } from '@/infrastructure/database/repositories/PgUserRepository';
import { AuthService } from '@/domain/user/auth.service';
import { LoginPayload } from '@/shared/types';

const userRepository = new PgUserRepository();
const authService = new AuthService(userRepository);

export async function POST(req: Request) {
  try {
    const body: LoginPayload = await req.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกอีเมลและรหัสผ่าน' },
        { status: 400 }
      );
    }

    const result = await authService.login(body);

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
