import fs from 'fs/promises';
import path from 'path';
import { type Result, success, failure } from '@/shared/types';
import { isValidImageType, isValidFileSize } from '@/shared/utils';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export class FileStore {
  async ensureDir(): Promise<void> {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }

  async saveImage(
    buffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<Result<string>> {
    if (!isValidImageType(mimeType)) {
      return failure('รองรับเฉพาะไฟล์ JPEG, PNG หรือ WebP');
    }

    if (!isValidFileSize(buffer.length)) {
      return failure('ขนาดไฟล์เกิน 10MB');
    }

    try {
      await this.ensureDir();

      const ext = mimeType.split('/')[1] === 'jpeg' ? 'jpg' : mimeType.split('/')[1];
      // Strip any existing extension off the original name so we don't end up
      // with a doubled suffix like "food.jpg.jpg".
      const baseName = filename
        .replace(/\.[^.]+$/, '')
        .replace(/[^a-zA-Z0-9-]/g, '_');
      const safeFilename = `${Date.now()}-${baseName}.${ext}`;
      const filePath = path.join(UPLOAD_DIR, safeFilename);

      await fs.writeFile(filePath, buffer);
      return success(`/uploads/${safeFilename}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'ไม่สามารถบันทึกไฟล์ได้';
      return failure(msg);
    }
  }

  async deleteImage(publicPath: string): Promise<Result<void>> {
    try {
      const fullPath = path.join(process.cwd(), 'public', publicPath);
      await fs.unlink(fullPath);
      return success(undefined);
    } catch {
      return failure('ไม่สามารถลบไฟล์ได้');
    }
  }
}
