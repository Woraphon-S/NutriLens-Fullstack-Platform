'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Flame, Trophy, Star, TrendingUp, Zap, Target, ArrowRight, Camera, Loader2 } from 'lucide-react';
import { getStreakEmoji, getLevelTitle, xpToNextLevel } from '@/shared/utils';

interface Progression {
  currentStreak: number;
  maxStreak: number;
  totalXp: number;
  currentLevel: number;
}

interface MealSummary {
  id: string;
  mealName: string;
  totalCalories: number;
  analyzedAt: string;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('คุณ');
  const [progression, setProgression] = useState<Progression | null>(null);
  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('nutrilens_token');
    if (!token) {
      router.replace('/login');
      return;
    }

    const storedUser = localStorage.getItem('nutrilens_user');
    if (storedUser) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- reading from an external store (localStorage) on mount
        setDisplayName(JSON.parse(storedUser).displayName || 'คุณ');
      } catch {
        /* ignore malformed user */
      }
    }

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('/api/profile/progression', { headers }).then((r) => r.json()),
      fetch('/api/meals/history?limit=100', { headers }).then((r) => r.json()),
    ])
      .then(([progRes, histRes]) => {
        if (progRes.success) setProgression(progRes.data);
        if (histRes.success) setMeals(histRes.data);
        if (!progRes.success && !histRes.success) {
          setError(progRes.error || histRes.error || 'ไม่สามารถโหลดข้อมูลได้');
        }
      })
      .catch(() => setError('เกิดข้อผิดพลาดในการเชื่อมต่อ'))
      .finally(() => setIsLoading(false));
  }, [router]);

  if (isLoading) {
    return (
      <div className="container-app py-24 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-health-green mx-auto mb-4" />
        <p className="text-health-muted">กำลังโหลดแดชบอร์ดของคุณ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-app py-24 text-center">
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl max-w-md mx-auto">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  const prog: Progression = progression ?? {
    currentStreak: 0,
    maxStreak: 0,
    totalXp: 0,
    currentLevel: 1,
  };

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const todayMeals = meals.filter((m) => isSameDay(new Date(m.analyzedAt), now));
  const todayCalories = todayMeals.reduce((sum, m) => sum + m.totalCalories, 0);

  const weeklyMeals = meals.filter((m) => new Date(m.analyzedAt) >= sevenDaysAgo);
  const weeklyAvgCalories = weeklyMeals.length
    ? Math.round(weeklyMeals.reduce((sum, m) => sum + m.totalCalories, 0) / 7)
    : 0;

  const recentMeals = meals.slice(0, 4);
  const xpProgress = prog.totalXp % 100;

  return (
    <div className="container-app py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 slide-up">
          <div>
            <h1 className="text-3xl font-bold text-health-dark mb-1">
              สวัสดี, <span className="text-health-green">{displayName}</span> 👋
            </h1>
            <p className="text-health-muted">{getLevelTitle(prog.currentLevel)}</p>
          </div>
          <Link href="/analyze" className="btn-primary inline-flex items-center gap-2 mt-4 md:mt-0 no-underline">
            <Camera className="w-5 h-5" />
            วิเคราะห์มื้อใหม่
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 slide-up delay-100">
          <StatCard
            icon={<Flame className="w-6 h-6 text-orange-500" />}
            label="Streak ปัจจุบัน"
            value={`${prog.currentStreak} วัน`}
            badge={getStreakEmoji(prog.currentStreak)}
            gradient="from-orange-50 to-amber-50"
          />
          <StatCard
            icon={<Star className="w-6 h-6 text-purple-500" />}
            label="เลเวลปัจจุบัน"
            value={`Lv. ${prog.currentLevel}`}
            badge="⭐"
            gradient="from-purple-50 to-violet-50"
          />
          <StatCard
            icon={<Zap className="w-6 h-6 text-health-green" />}
            label="XP สะสม"
            value={`${prog.totalXp} XP`}
            badge="⚡"
            gradient="from-green-50 to-emerald-50"
          />
          <StatCard
            icon={<Trophy className="w-6 h-6 text-yellow-500" />}
            label="Streak สูงสุด"
            value={`${prog.maxStreak} วัน`}
            badge="🏆"
            gradient="from-yellow-50 to-amber-50"
          />
        </div>

        {/* XP Progress Bar */}
        <div className="glass-card p-6 mb-8 slide-up delay-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="level-badge">
                <Star className="w-4 h-4" />
                Level {prog.currentLevel}
              </div>
              <span className="text-sm text-health-muted">
                → Level {prog.currentLevel + 1}
              </span>
            </div>
            <span className="text-sm font-medium text-health-green">
              อีก {xpToNextLevel(prog.totalXp)} XP
            </span>
          </div>
          <div className="xp-bar">
            <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }} />
          </div>
          <p className="text-xs text-health-muted mt-2 text-center">
            ได้รับ {25} XP ทุกมื้อ + โบนัส {10} XP เมื่อ Streak ต่อเนื่อง
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today Summary */}
          <div className="glass-card p-6 slide-up delay-300">
            <h3 className="text-lg font-semibold text-health-dark mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-health-green" />
              สรุปวันนี้
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-health-bg">
                <div>
                  <p className="text-sm text-health-muted">แคลอรี่รวมวันนี้</p>
                  <p className="text-2xl font-bold text-health-dark">
                    {todayCalories} <span className="text-sm font-normal text-health-muted">แคล</span>
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-health-green to-health-emerald flex items-center justify-center text-white font-bold">
                  {todayMeals.length}
                  <span className="text-xs ml-0.5">มื้อ</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-health-bg">
                <div>
                  <p className="text-sm text-health-muted">เฉลี่ยต่อสัปดาห์</p>
                  <p className="text-2xl font-bold text-health-dark">
                    {weeklyAvgCalories} <span className="text-sm font-normal text-health-muted">แคล/วัน</span>
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-health-green" />
              </div>
            </div>
          </div>

          {/* Recent Meals */}
          <div className="glass-card p-6 slide-up delay-400">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-health-dark">🍽️ มื้อล่าสุด</h3>
              <Link href="/history" className="text-sm text-health-green hover:underline inline-flex items-center gap-1 no-underline">
                ดูทั้งหมด
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {recentMeals.length === 0 ? (
              <div className="text-center py-10">
                <span className="text-4xl mb-3 block">🍽️</span>
                <p className="text-health-muted text-sm mb-4">ยังไม่มีมื้ออาหารที่บันทึกไว้</p>
                <Link href="/analyze" className="btn-primary inline-flex items-center gap-2 no-underline text-sm">
                  <Camera className="w-4 h-4" />
                  เริ่มวิเคราะห์มื้อแรก
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMeals.map((meal) => {
                  const date = new Date(meal.analyzedAt);
                  return (
                    <div key={meal.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-health-bg transition-colors">
                      <div>
                        <p className="font-medium text-health-dark text-sm">{meal.mealName}</p>
                        <p className="text-xs text-health-muted">
                          {date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}{' '}
                          {date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span className="font-semibold text-health-green text-sm">{meal.totalCalories} แคล</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  badge,
  gradient,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge: string;
  gradient: string;
}) {
  return (
    <div className={`glass-card p-5 bg-gradient-to-br ${gradient}`}>
      <div className="flex items-start justify-between mb-3">
        {icon}
        <span className="text-lg">{badge}</span>
      </div>
      <p className="text-xl font-bold text-health-dark">{value}</p>
      <p className="text-xs text-health-muted mt-1">{label}</p>
    </div>
  );
}
