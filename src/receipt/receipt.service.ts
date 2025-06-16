import { Injectable } from '@nestjs/common';
import type { ExtractionData } from './types/data-extraction-type';

@Injectable()
export class ReceiptService {
  extractData(body: { file: Express.Multer.File }): ExtractionData | null {
    const { file } = body;
    if (!file) {
      return null;
    }
    // TODO: Implement the actual data extraction logic here
    return null;
  }
}
