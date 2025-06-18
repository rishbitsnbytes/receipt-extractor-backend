import { IMAGE_MIME_TYPES } from './constants';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Request } from 'express';
import type { FileFilterCallback } from 'multer';

// fileFilter function to validate uploaded files
function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void {
  if (!IMAGE_MIME_TYPES.includes(file.mimetype)) {
    return cb(new Error('Only PNG, JPG and JPEG images are allowed!'));
  }
  cb(null, true);
}

// UUID-based filename
function filename(
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void,
): void {
  const ext: string = extname(file.originalname);
  const uuid: string = uuidv4();
  const uniqueName: string = `${uuid}${ext}`;
  cb(null, uniqueName);
}

export { fileFilter, filename };
