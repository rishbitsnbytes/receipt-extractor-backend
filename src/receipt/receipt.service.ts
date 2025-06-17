import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ExtractionData } from './types/data-extraction-type';
import { Receipt, ReceiptDocument } from './entities/receipt.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class ReceiptService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Receipt.name)
    private readonly receiptModel: Model<ReceiptDocument>,
  ) {}

  async extractData(file: Express.Multer.File): Promise<ExtractionData> {
    const baseUrl = this.configService.get<string>(
      'BASE_URL',
      'http://localhost:3000',
    );
    const imageUrl = `${baseUrl}/public/uploads/${file.filename}`;

    // Prepare the data to save
    const receiptToSave = {
      date: null,
      currency: null,
      vendorName: null,
      receiptItems: [],
      aiProvider: null,
      tax: null,
      total: null,
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
      items: [],
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
