import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AIProvider } from '../enums/ai-provider.enum';

@Schema({ _id: false }) // Subdocument schema for receipt items
export class ReceiptItem {
  @Prop({ type: String, default: null })
  itemName: string | null;

  @Prop({ type: String, default: null })
  itemCost: string | null;
}

const ReceiptItemSchema = SchemaFactory.createForClass(ReceiptItem);

@Schema({ timestamps: true, collection: 'receipts' })
export class Receipt {
  @Prop({ type: String, default: null })
  date: string | null;

  @Prop({ type: String, default: null })
  currency: string | null;

  @Prop({ type: String, default: null })
  vendorName: string | null;

  @Prop({ type: [ReceiptItemSchema], default: [] })
  receiptItems: ReceiptItem[];

  @Prop({ type: String, enum: Object.values(AIProvider), default: null })
  aiProvider: AIProvider | null;

  @Prop({ type: String, default: null })
  tax: string | null;

  @Prop({ type: String, default: null })
  total: string | null;

  @Prop({ type: String, default: null })
  imageUrl: string | null;
}

export type ReceiptDocument = Receipt & Document;
export const ReceiptSchema = SchemaFactory.createForClass(Receipt);
