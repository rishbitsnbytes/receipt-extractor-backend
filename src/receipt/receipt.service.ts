import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ExtractionData } from './types/data-extraction-type';
import { Receipt, ReceiptDocument } from './entities/receipt.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GoogleDocumentAiProvider } from './providers/google-document-ai.provider';
import { AIProvider } from './enums/ai-provider.enum';
@Injectable()
export class ReceiptService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Receipt.name)
    private readonly receiptModel: Model<ReceiptDocument>,
    private readonly aiProvider: GoogleDocumentAiProvider,
  ) {}

  async extractData(file: Express.Multer.File): Promise<ExtractionData> {
    // async extractData(file: Express.Multer.File): Promise<void> {

    const baseUrl = this.configService.get<string>(
      'BASE_URL',
      'http://localhost:3000',
    );
    const imageUrl = `${baseUrl}/public/uploads/${file.filename}`;

    // Call Google Document AI provider (response is any)
    const extractedData = await this.aiProvider.extractFromImage(file.path);

    // Prepare the data to save
    const receiptToSave = {
      date: extractedData.date || null,
      currency: extractedData.currency || null,
      vendorName: extractedData.vendor || null,
      receiptItems: extractedData.items || [],
      aiProvider: AIProvider.GOOGLE_DOCUMENT_AI,
      tax: extractedData.tax || null,
      total: extractedData.total || null,
      imageUrl,
    };

    // Save to MongoDB
    const saved = await this.receiptModel.create(receiptToSave);

    // Return ExtractionData structure
    return {
      id: saved._id.toString(),
      imageUrl: saved.imageUrl,
      date: saved.date,
      currency: saved.currency,
      vendor: saved.vendorName,
      items: saved.receiptItems,
      tax:
        saved.tax !== null && saved.tax !== undefined
          ? Number(saved.tax)
          : null,
      total:
        saved.total !== null && saved.total !== undefined
          ? Number(saved.total)
          : null,
    };
  }
}
