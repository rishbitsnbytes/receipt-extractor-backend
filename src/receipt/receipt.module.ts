import { Module } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { ReceiptController } from './receipt.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Receipt, ReceiptSchema } from './entities/receipt.entity';
import { GoogleDocumentAiProvider } from './providers/google-document-ai.provider';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Receipt.name, schema: ReceiptSchema }]),
  ],
  controllers: [ReceiptController],
  providers: [ReceiptService, GoogleDocumentAiProvider],
})
export class ReceiptModule {}
