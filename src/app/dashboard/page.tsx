'use client';

import { Flame, Trophy, Star, TrendingUp, Zap, Target, ArrowRight, Camera } from 'lucide-react';
import { getStreakEmoji, getLevelTitle } from '@/shared/utils';

// Mock data — จะเปลี่ยนเป็น API จริงเมื่อเชื่อม DB
const mockProfile = {
  displayName: 'นักสุขภาพ',
  currentStreak: 7,
  maxStreak: 14,
  totalXp: 425,
  currentLevel: 5,
  xpToNextLevel: 75,
  todayCalories: 1240,
  todayMeals: 2,
  weeklyAvgCalories: 1850,
};

const mockRecentMeals = [
  { id: '1', mealName: 'ข้าวผัดกะเพราไก่', totalCalories: 520, analyzedAt: new Date('2026-04-25T08:30:00') },
  { id: '2', mealName: 'สลัดอกไก่', totalCalories: 320, analyzedAt: new Date('2026-04-25T12:15:00') },
  { id: '3', mealName: 'ต้มยำกุ้ง', totalCalories: 180, analyzedAt: new Date('2026-04-24T18:00:00') },
  { id: '4', mealName: 'ข้าวมันไก่', totalCalories: 650, analyzedAt: new Date('2026-04-24T12:00:00') },
];

export default function DashboardPage() {
  const profile = mockProfile;
  const xpProgress = ((profile.totalXp % 100) / 100) * 100;

  return (
    <div className="container-app py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 slide-up">
          <div>
            <h1 className="text-3xl font-bold text-health-dark mb-1">
              สวัสดี, <span className="text-health-green">{profile.displayName}</span> 👋
            </h1>
            <p className="text-health-muted">{getLevelTitle(profile.currentLevel)}</p>
          </div>
          <a href="/analyze" className="btn-primary inline-flex items-center gap-2 mt-4 md:mt-0 no-underline">
            <Camera className="w-5 h-5" />
            วิเคราะห์มื้อใหม่
          </a>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 slide-up delay-100">
          <StatCard
            icon={<Flame className="w-6 h-6 text-orange-500" />}
            label="Streak ปัจจุบัน"
            value={`${profile.currentStreak} วัน`}
            badge={getStreakEmoji(profile.currentStreak)}
            gradient="from-orange-50 to-amber-50"
          />
          <StatCard
            icon={<Star className="w-6 h-6 text-purple-500" />}
            label="เลเวลปัจจุบัน"
            value={`Lv. ${profile.currentLevel}`}
            badge="⭐"
            gradient="from-purple-50 to-violet-50"
          />
          <StatCard
            icon={<Zap className="w-6 h-6 text-health-green" />}
            label="XP สะสม"
            value={`${profile.totalXp} XP`}
            badge="⚡"
            gradient="from-green-50 to-emerald-50"
          />
          <StatCard
            icon={<Trophy className="w-6 h-6 text-yellow-500" />}
            label="Streak สูงสุด"
            value={`${profile.maxStreak} วัน`}
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
                Level {profile.currentLevel}
              </div>
              <span className="text-sm text-health-muted">
                → Level {profile.currentLevel + 1}
              </span>
            </div>
            <span className="text-sm font-medium text-health-green">
              อีก {profile.xpToNextLevel} XP
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
                  <p className="text-2xl font-bold text-health-dark">{profile.todayCalories} <span className="text-sm font-normal text-health-muted">แคล</span></p>
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-health-green to-health-emerald flex items-center justify-center text-white font-bold">
                  {profile.todayMeals}
                  <span className="text-xs ml-0.5">มื้อ</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-health-bg">
                <div>
                  <p className="text-sm text-health-muted">เฉลี่ยต่อสัปดาห์</p>
                  <p className="text-2xl font-bold text-health-dark">{profile.weeklyAvgCalories} <span className="text-sm font-normal text-health-muted">แคล/วัน</span></p>
                </div>
                <TrendingUp className="w-8 h-8 text-health-green" />
              </div>
            </div>
          </div>

          {/* Recent Meals */}
          <div className="glass-card p-6 slide-up delay-400">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-health-dark">🍽️ มื้อล่าสุด</h3>
              <a href="/history" className="text-sm text-health-green hover:underline inline-flex items-center gap-1 no-underline">
                ดูทั้งหมด
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
            <div className="space-y-3">
              {mockRecentMeals.map((meal) => (
                <div key={meal.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-health-bg transition-colors">
                  <div>
                    <p className="font-medium text-health-dark text-sm">{meal.mealName}</p>
                    <p className="text-xs text-health-muted">
                      {meal.analyzedAt.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                      {' '}
                      {meal.analyzedAt.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className="font-semibold text-health-green text-sm">{meal.totalCalories} แคล</span>
                </div>
              ))}
            </div>
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
