import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import * as fs from 'fs';
import * as path from 'path';
import type {
  DocumentAiProvider,
  ExtractionData,
  ReceiptItem,
} from '../types/data-extraction-type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleDocumentAiProvider implements DocumentAiProvider {
  private readonly client: DocumentProcessorServiceClient;
  private readonly projectId: string;
  private readonly location: string;
  private readonly processorId: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new DocumentProcessorServiceClient();
    this.projectId = this.configService.get<string>('GCP_PROJECT_ID', '');
    this.location = this.configService.get<string>('GCP_LOCATION', '');
    this.processorId = this.configService.get<string>('GCP_PROCESSOR_ID', '');
  }

  async extractFromImage(imagePath: string): Promise<ExtractionData> {
    const mimeType = this.getMimeType(imagePath);
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const name = this.client.processorPath(
      this.projectId,
      this.location,
      this.processorId,
    );

    const request = {
      name,
      rawDocument: {
        content: base64Image,
        mimeType,
      },
    };

    try {
      const [result]: any = await this.client.processDocument(request);
      const document = result.document;
      const entities = (document.entities || []) as any[];

      // Helper to get value by type
      const getEntityValue = (type: string) =>
        entities.find((e) => e.type?.toLowerCase() === type.toLowerCase())
          ?.mentionText || null;

      // Extract line items robustly
      const items: ReceiptItem[] =
        entities
          .filter((e) => e.type?.toLowerCase() === 'line_item')
          .map((e) => {
            const props = e.properties || [];
            return {
              name:
                props.find(
                  (p: any) => p.type?.toLowerCase() === 'line_item/description',
                )?.mentionText || null,
              cost:
                props.find(
                  (p: any) => p.type?.toLowerCase() === 'line_item/amount',
                )?.mentionText || null,
            };
          }) || [];

      return {
        imageUrl: '', // Will be set in ReceiptService
        date:
          getEntityValue('date') ||
          getEntityValue('receipt_date') ||
          getEntityValue('transaction_date') ||
          null,
        currency:
          getEntityValue('currency') || getEntityValue('currency_code') || null,
        vendor:
          getEntityValue('supplier_name') ||
          getEntityValue('vendor_name') ||
          getEntityValue('merchant_name') ||
          null,
        items,
        tax:
          getEntityValue('tax') ||
          getEntityValue('total_tax_amount') ||
          getEntityValue('tax_amount') ||
          null,
        total:
          getEntityValue('total_amount') || getEntityValue('total') || null,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to process image with Document AI',
      );
    }
  }

  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.png') return 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
    return 'application/octet-stream';
  }
}
