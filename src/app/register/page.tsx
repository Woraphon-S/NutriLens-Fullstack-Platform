'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('เริ่มส่งข้อมูลไปที่เซิร์ฟเวอร์...');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      }

      localStorage.setItem('nutrilens_token', result.data.token);
      localStorage.setItem('nutrilens_user', JSON.stringify(result.data.user));

      toast.success('สมัครสมาชิกสำเร็จ! ยินดีต้อนรับสู่ NutriLens');

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full slide-up">
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">🌱</span>
          <h2 className="text-3xl font-bold text-health-dark mb-2">สมัครสมาชิกใหม่</h2>
          <p className="text-health-muted">สร้างบัญชีเพื่อเริ่มเก็บประวัติและสะสม XP</p>
        </div>

        <div className="glass-card p-8 shadow-xl border-t-4 border-health-green">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="block text-sm font-medium text-health-text mb-1.5 ml-1">ชื่อที่ใช้แสดง (Display Name)</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-health-muted" />
                <input
                  type="text"
                  required
                  placeholder="เช่น สมชาย สายสุขภาพ"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-health-border focus:ring-2 focus:ring-health-green/30 focus:border-health-green outline-none transition-all"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                />
              </div>
            </div>

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
                  placeholder="อย่างน้อย 6 ตัวอักษร"
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
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 group shadow-lg shadow-health-green/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  สร้างบัญชีผู้ใช้
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-health-border text-center">
            <p className="text-sm text-health-muted">
              มีบัญชีอยู่แล้วใช่ไหม? 
              <a href="/login" className="ml-1.5 font-bold text-health-green hover:underline">
                เข้าสู่ระบบที่นี่
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
