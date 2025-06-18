import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import type { Express } from 'express';
import { ReceiptService } from './receipt.service';
import { filename, fileFilter, MAX_FILE_SIZE_IN_BYTES } from '../utils';
import type { ExtractionData } from './types/data-extraction-type';

@Controller('extract-receipt-details')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'public', 'uploads'),
        filename,
      }),
      fileFilter,
      limits: { fileSize: MAX_FILE_SIZE_IN_BYTES },
    }),
  )
  async extractReceiptDetails(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ExtractionData | null> {
    if (!file) throw new BadRequestException('File is required');
    return this.receiptService.extractReceiptDetails(file);
  }
}
