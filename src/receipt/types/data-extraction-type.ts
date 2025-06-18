export interface ReceiptItem {
  name: string | null;
  cost: number | string | null;
}

export interface ExtractionData {
  id?: string;
  imageUrl: string;
  date: string | null;
  currency: string | null;
  vendor: string | null;
  items: ReceiptItem[];
  tax?: number | null;
  total: number | null;
}
export interface DocumentAiProvider {
  extractFromImage(imagePath: string): Promise<ExtractionData>;
}
