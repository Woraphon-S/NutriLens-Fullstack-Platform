import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  type AnalysisResult,
  type Result,
  success,
  failure,
} from '@/shared/types';
import type { NutritionAnalyzer } from '@/domain/meals/meal.service';

const ANALYSIS_PROMPT = `คุณคือนักโภชนาการ AI ผู้เชี่ยวชาญ วิเคราะห์ภาพอาหารนี้และตอบกลับเป็น JSON เท่านั้น (ไม่ต้องมี markdown wrapper)

รูปแบบ JSON ที่ต้องการ:
{
  "mealName": "ชื่อเมนูอาหาร (ภาษาไทย)",
  "ingredients": [
    {
      "name": "ชื่อวัตถุดิบ (ภาษาไทย)",
      "estimatedWeightG": 100,
      "calories": 150,
      "protein": 10.5,
      "carbs": 20.0,
      "fat": 5.0
    }
  ],
  "totalCalories": 500,
  "macros": {
    "protein": 25.0,
    "carbs": 60.0,
    "fat": 15.0
  },
  "healthTip": "คำแนะนำสั้นๆ เกี่ยวกับเมนูนี้ (ภาษาไทย)"
}

กฎ:
1. ประมาณค่าจากขนาดจานที่เห็น ถ้าไม่แน่ใจให้ใช้ค่าเฉลี่ย
2. หน่วยน้ำหนักเป็นกรัม, แคลอรี่เป็น kcal, สารอาหารเป็นกรัม
3. ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่น`;

export class GeminiClient implements NutritionAnalyzer {
  private model;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY ไม่ได้ตั้งค่าใน environment');

    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async analyzeImage(imageBuffer: Buffer): Promise<Result<AnalysisResult>> {
    try {
      const base64Image = imageBuffer.toString('base64');
      const mimeType = this.detectMimeType(imageBuffer);

      const result = await this.model.generateContent([
        ANALYSIS_PROMPT,
        {
          inlineData: {
            data: base64Image,
            mimeType,
          },
        },
      ]);

      const response = result.response;
      const text = response.text();

      // Strip markdown code fences if present
      const cleaned = text
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();

      const parsed: AnalysisResult = JSON.parse(cleaned);
      return success(parsed);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ข้อผิดพลาดที่ไม่ทราบสาเหตุ';
      return failure(`Gemini AI Error: ${message}`);
    }
  }

  private detectMimeType(buffer: Buffer): string {
    // PNG: 89 50 4E 47
    if (buffer[0] === 0x89 && buffer[1] === 0x50) return 'image/png';
    // WEBP: 52 49 46 46 ... 57 45 42 50
    if (buffer[0] === 0x52 && buffer[1] === 0x49) return 'image/webp';
    // Default to JPEG
    return 'image/jpeg';
  }
}
