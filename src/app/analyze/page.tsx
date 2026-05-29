'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Camera, Upload, X, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import type { AnalysisResult } from '@/shared/types';

interface ExtendedAnalysis extends AnalysisResult {
  imagePath?: string;
}

export default function AnalyzePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ExtendedAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('รองรับเฉพาะไฟล์ JPEG, PNG หรือ WebP');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('ขนาดไฟล์เกิน 10MB');
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    setResult(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setError(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('nutrilens_token') : null;

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'เกิดข้อผิดพลาดในการวิเคราะห์');
        return;
      }

      setResult(data.data);
    } catch {
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetState = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isMember = typeof window !== 'undefined' && !!localStorage.getItem('nutrilens_token');

  return (
    <div className="container-app py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 slide-up">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${
            isMember ? 'bg-amber-100 text-amber-700' : 'bg-health-green-light/30 text-health-green-dark'
          }`}>
            {isMember ? <Sparkles className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
            {isMember ? 'Member Mode — บันทึกข้อมูลอัตโนมัติ' : 'Guest Mode — ไม่ต้องสมัครสมาชิก'}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-health-dark mb-3">
            วิเคราะห์อาหาร<span className="text-health-green"> ด้วย AI</span>
          </h1>
          <p className="text-health-muted">
            อัปโหลดรูปอาหาร แล้ว Gemini AI จะวิเคราะห์สารอาหารให้คุณทันที
          </p>
        </div>

        {/* Upload OR Result */}
        {!result ? (
          <div className="slide-up delay-100">
            {/* Dropzone */}
            <div
              className={`dropzone mb-6 ${isDragging ? 'active' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />

              {previewUrl ? (
                <div className="relative inline-block">
                  <img
                    src={previewUrl}
                    alt="ตัวอย่างภาพ"
                    className="max-h-72 rounded-xl object-cover mx-auto shadow-lg"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); resetState(); }}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-2xl bg-health-green-light/30 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-10 h-10 text-health-green" />
                  </div>
                  <p className="text-health-dark font-semibold mb-1">
                    ลากรูปมาวางที่นี่ หรือคลิกเลือกไฟล์
                  </p>
                  <p className="text-sm text-health-muted">
                    รองรับ JPEG, PNG, WebP — ขนาดไม่เกิน 10MB
                  </p>
                </>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm text-center">
                {error}
              </div>
            )}

            {/* Analyze Button */}
            {selectedImage && (
              <div className="text-center">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="btn-primary inline-flex items-center gap-2 text-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      กำลังวิเคราะห์...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      เริ่มวิเคราะห์ด้วย AI
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Loading Animation */}
            {isAnalyzing && (
              <div className="mt-10 text-center fade-in">
                <div className="spinner mx-auto mb-4" />
                <p className="text-health-green font-medium">Gemini AI กำลังวิเคราะห์อาหาร...</p>
                <p className="text-sm text-health-muted mt-1">อาจใช้เวลาสักครู่</p>
              </div>
            )}
          </div>
        ) : (
          <ResultsView result={result} imagePath={previewUrl} onReset={resetState} isMember={isMember} />
        )}
      </div>
    </div>
  );
}

function ResultsView({
  result,
  imagePath,
  onReset,
  isMember,
}: {
  result: ExtendedAnalysis;
  imagePath: string | null;
  onReset: () => void;
  isMember: boolean;
}) {
  const totalMacroG = result.macros.protein + result.macros.carbs + result.macros.fat;
  const proteinPct = totalMacroG > 0 ? Math.round((result.macros.protein / totalMacroG) * 100) : 0;
  const carbsPct = totalMacroG > 0 ? Math.round((result.macros.carbs / totalMacroG) * 100) : 0;
  const fatPct = totalMacroG > 0 ? Math.round((result.macros.fat / totalMacroG) * 100) : 0;

  return (
    <div className="fade-in space-y-6">
      {/* Top Card — Meal Summary */}
      <div className="glass-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {imagePath && (
            <img
              src={imagePath}
              alt={result.mealName}
              className="w-full md:w-48 h-48 rounded-xl object-cover shadow-md"
            />
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-health-dark mb-2">{result.mealName}</h2>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-extrabold text-health-green">{result.totalCalories}</span>
              <span className="text-health-muted font-medium">แคลอรี่</span>
            </div>

            {/* Macro Bars */}
            <div className="space-y-3">
              <MacroBar label="โปรตีน" grams={result.macros.protein} pct={proteinPct} color="bg-health-protein" />
              <MacroBar label="คาร์บ" grams={result.macros.carbs} pct={carbsPct} color="bg-health-carbs" />
              <MacroBar label="ไขมัน" grams={result.macros.fat} pct={fatPct} color="bg-health-fat" />
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients Table */}
      <div className="glass-card p-6 md:p-8">
        <h3 className="text-lg font-semibold text-health-dark mb-4">🥗 วัตถุดิบที่ตรวจพบ</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-health-border">
                <th className="text-left py-3 px-2 font-semibold text-health-text">วัตถุดิบ</th>
                <th className="text-right py-3 px-2 font-semibold text-health-text">น้ำหนัก</th>
                <th className="text-right py-3 px-2 font-semibold text-health-text">แคล</th>
                <th className="text-right py-3 px-2 font-semibold text-health-protein">P</th>
                <th className="text-right py-3 px-2 font-semibold text-health-carbs">C</th>
                <th className="text-right py-3 px-2 font-semibold text-health-fat">F</th>
              </tr>
            </thead>
            <tbody>
              {result.ingredients.map((ing, i) => (
                <tr key={i} className="border-b border-health-border/50 hover:bg-health-bg/50 transition-colors">
                  <td className="py-3 px-2 font-medium text-health-dark">{ing.name}</td>
                  <td className="py-3 px-2 text-right text-health-muted">{ing.estimatedWeightG}g</td>
                  <td className="py-3 px-2 text-right font-semibold text-health-dark">{ing.calories}</td>
                  <td className="py-3 px-2 text-right text-health-protein">{ing.protein}g</td>
                  <td className="py-3 px-2 text-right text-health-carbs">{ing.carbs}g</td>
                  <td className="py-3 px-2 text-right text-health-fat">{ing.fat}g</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Health Tip */}
      {result.healthTip && (
        <div className="glass-card p-6 bg-gradient-to-r from-health-bg to-white">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">💡</span>
            <div>
              <h4 className="font-semibold text-health-dark mb-1">คำแนะนำจาก AI</h4>
              <p className="text-sm text-health-muted leading-relaxed">{result.healthTip}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button onClick={onReset} className="btn-primary inline-flex items-center gap-2">
          <Camera className="w-5 h-5" />
          วิเคราะห์อีกครั้ง
        </button>
        {isMember ? (
          <Link href="/history" className="btn-secondary inline-flex items-center gap-2 no-underline">
            ดูประวัติทั้งหมด
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link href="/register" className="btn-secondary inline-flex items-center gap-2 no-underline">
            สมัครสมาชิกเพื่อบันทึก
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

function MacroBar({ label, grams, pct, color }: { label: string; grams: number; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-health-dark">{label}</span>
        <span className="text-health-muted">{grams.toFixed(1)}g ({pct}%)</span>
      </div>
      <div className="h-2.5 rounded-full bg-health-border overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
