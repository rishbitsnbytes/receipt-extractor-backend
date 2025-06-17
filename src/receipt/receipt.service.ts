import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ExtractionData } from './types/data-extraction-type';
@Injectable()
export class ReceiptService {
  constructor(private readonly configService: ConfigService) {}

  extractData(file: Express.Multer.File): ExtractionData {
    const baseUrl = this.configService.get<string>(
      'BASE_URL',
      'http://localhost:3000',
    );
    const imageUrl = `${baseUrl}/public/uploads/${file.filename}`;
    return {
      imageUrl,
      date: null,
      currency: null,
      vendor: null,
      items: [],
      total: null,
    };
  }
}
