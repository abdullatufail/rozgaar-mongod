import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export interface UploadedFile {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
}

export async function saveUploadedFile(
  file: File,
  uploadDir: string = 'uploads'
): Promise<UploadedFile> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create uploads directory if it doesn't exist
  const fullUploadDir = path.join(process.cwd(), 'public', uploadDir);
  if (!existsSync(fullUploadDir)) {
    await mkdir(fullUploadDir, { recursive: true });
  }

  // Generate unique filename
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const ext = path.extname(file.name);
  const filename = `file-${uniqueSuffix}${ext}`;
  const filepath = path.join(fullUploadDir, filename);

  // Validate file type
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip'
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only jpg, jpeg, png, pdf, doc, docx and zip files are allowed.');
  }

  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size too large. Maximum size is 10MB.');
  }

  // Save file
  await writeFile(filepath, buffer);

  return {
    filename,
    originalname: file.name,
    mimetype: file.type,
    size: file.size,
    path: `/${uploadDir}/${filename}`
  };
}

export function getFileUrl(filename: string, uploadDir: string = 'uploads'): string {
  return `/${uploadDir}/${filename}`;
}
