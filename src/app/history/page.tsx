'use client';

import { useState, useEffect } from 'react';
import { Calendar, Search, ChevronDown, ChevronUp, Camera, Loader2 } from 'lucide-react';

interface MealHistory {
  id: string;
  mealName: string;
  totalCalories: number;
  analyzedAt: Date;
  imagePath: string | null;
  macros: { protein: number; carbs: number; fat: number };
  ingredients: Array<{
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
}

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [history, setHistory] = useState<MealHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('nutrilens_token') : null;

      try {
        const response = await fetch('/api/meals/history', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });

        const result = await response.json();

        if (result.success) {
          // Convert date strings back to Date objects
          const processed = result.data.map((m: any) => ({
            ...m,
            analyzedAt: new Date(m.analyzedAt)
          }));
          setHistory(processed);
        } else {
          setError(result.error || 'ไม่สามารถโหลดประวัติได้');
        }
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredMeals = history.filter((m) =>
    m.mealName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const grouped = groupByDate(filteredMeals);

  if (isLoading) {
    return (
      <div className="container-app py-24 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-health-green mx-auto mb-4" />
        <p className="text-health-muted">กำลังโหลดประวัติของคุณ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-app py-24 text-center">
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl max-w-md mx-auto">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">ลองใหม่อีกครั้ง</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 slide-up">
          <h1 className="text-3xl font-bold text-health-dark mb-2">
            📋 ประวัติ<span className="text-health-green">การวิเคราะห์</span>
          </h1>
          <p className="text-health-muted">ดูย้อนหลังทุกมื้อที่ AI วิเคราะห์ให้คุณ</p>
        </div>

        {/* Search */}
        <div className="relative mb-8 slide-up delay-100">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-health-muted" />
          <input
            type="text"
            placeholder="ค้นหาชื่ออาหาร..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-health-border bg-white text-health-dark placeholder-health-muted focus:outline-none focus:ring-2 focus:ring-health-green/30 focus:border-health-green transition-all"
          />
        </div>

        {/* Grouped List */}
        {filteredMeals.length === 0 ? (
          <div className="text-center py-20 slide-up delay-200">
            <span className="text-5xl mb-4 block">🍽️</span>
            <p className="text-health-muted mb-4">ยังไม่มีประวัติการวิเคราะห์</p>
            <a href="/analyze" className="btn-primary inline-flex items-center gap-2 no-underline">
              <Camera className="w-5 h-5" />
              เริ่มวิเคราะห์มื้อแรก
            </a>
          </div>
        ) : (
          <div className="space-y-8 slide-up delay-200">
            {Object.entries(grouped).map(([dateLabel, meals]) => (
              <div key={dateLabel}>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-health-green" />
                  <h3 className="text-sm font-semibold text-health-text">{dateLabel}</h3>
                  <span className="text-xs text-health-muted">({meals.length} มื้อ)</span>
                </div>

                <div className="space-y-3">
                  {meals.map((meal) => (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      expanded={expandedId === meal.id}
                      onToggle={() => setExpandedId(expandedId === meal.id ? null : meal.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {filteredMeals.length > 0 && (
          <div className="glass-card p-6 mt-10 text-center bg-gradient-to-r from-health-bg to-white">
            <p className="text-sm text-health-muted">
              แสดง <span className="font-semibold text-health-dark">{filteredMeals.length}</span> มื้ออาหาร ·
              รวม <span className="font-semibold text-health-green">{filteredMeals.reduce((sum, m) => sum + m.totalCalories, 0).toLocaleString()}</span> แคลอรี่
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function MealCard({
  meal,
  expanded,
  onToggle,
}: {
  meal: MealHistory;
  expanded: boolean;
  onToggle: () => void;
}) {
  const totalMacro = meal.macros.protein + meal.macros.carbs + meal.macros.fat;
  const pPct = totalMacro > 0 ? Math.round((meal.macros.protein / totalMacro) * 100) : 0;
  const cPct = totalMacro > 0 ? Math.round((meal.macros.carbs / totalMacro) * 100) : 0;
  const fPct = totalMacro > 0 ? Math.round((meal.macros.fat / totalMacro) * 100) : 0;

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-health-bg/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-health-green-light/30 flex items-center justify-center text-lg flex-shrink-0">
            🍽️
          </div>
          <div>
            <p className="font-medium text-health-dark">{meal.mealName}</p>
            <p className="text-xs text-health-muted">
              {meal.analyzedAt.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-health-green">{meal.totalCalories} แคล</span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-health-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-health-muted" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-health-border/50 fade-in">
          {/* Macro Summary */}
          <div className="flex gap-3 my-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-health-protein font-medium">
              P: {meal.macros.protein}g ({pPct}%)
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-health-carbs font-medium">
              C: {meal.macros.carbs}g ({cPct}%)
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-health-fat font-medium">
              F: {meal.macros.fat}g ({fPct}%)
            </span>
          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            {meal.ingredients.map((ing, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-health-border/30 last:border-0">
                <span className="text-health-dark">{ing.name}</span>
                <span className="text-health-muted">{ing.calories} แคล</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function groupByDate(meals: MealHistory[]): Record<string, MealHistory[]> {
  const groups: Record<string, MealHistory[]> = {};
  for (const meal of meals) {
    const label = meal.analyzedAt.toLocaleDateString('th-TH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groups[label]) groups[label] = [];
    groups[label].push(meal);
  }
  return groups;
}
