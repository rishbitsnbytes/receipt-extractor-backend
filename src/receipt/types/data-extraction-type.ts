export interface ReceiptItem {
  name: string;
  cost: number | string;
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
