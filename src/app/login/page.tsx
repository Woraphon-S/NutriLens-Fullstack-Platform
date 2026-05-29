'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

// Built-in demo account (seeded in the database) for quick try-outs
const DEMO_CREDENTIALS = { email: 'demo@nutrilens.ai', password: 'demo1234' };

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const doLogin = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }

      localStorage.setItem('nutrilens_token', result.data.token);
      localStorage.setItem('nutrilens_user', JSON.stringify(result.data.user));

      toast.success(`ยินดีต้อนรับกลับมา! คุณ ${result.data.user.displayName}`);

      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doLogin(formData);
  };

  const handleDemoLogin = () => {
    setFormData(DEMO_CREDENTIALS);
    doLogin(DEMO_CREDENTIALS);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full slide-up">
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">🍃</span>
          <h2 className="text-3xl font-bold text-health-dark mb-2">ยินดีต้อนรับกลับมา</h2>
          <p className="text-health-muted">กรุณาเข้าสู่ระบบเพื่อดูประวัติและแดชบอร์ดของคุณ</p>
        </div>

        <div className="glass-card p-8">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-sm font-medium text-health-text mb-1.5 ml-1">อีเมล</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-health-muted" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-health-border focus:ring-2 focus:ring-health-green/30 focus:border-health-green outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-health-text mb-1.5 ml-1">รหัสผ่าน</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-health-muted" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-health-border focus:ring-2 focus:ring-health-green/30 focus:border-health-green outline-none transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium animate-shake text-center border border-red-100">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 mt-2 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  เข้าสู่ระบบ
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Demo account — try the app without signing up */}
          <div className="mt-4">
            <div className="relative flex items-center my-4">
              <div className="flex-grow border-t border-health-border" />
              <span className="mx-3 text-xs text-health-muted">หรือ</span>
              <div className="flex-grow border-t border-health-border" />
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="btn-secondary w-full py-3 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              ลองใช้งานด้วยบัญชีทดลอง (Demo)
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-health-border text-center">
            <p className="text-sm text-health-muted">
              ยังไม่มีบัญชีใช่ไหม?
              <Link href="/register" className="ml-1.5 font-bold text-health-green hover:underline">
                สมัครสมาชิกฟรี
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
