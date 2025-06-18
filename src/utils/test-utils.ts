import { ExtractionData } from 'src/receipt/types/data-extraction-type';

export const mockExtractionData: ExtractionData = {
  date: '2024-06-18',
  currency: 'USD',
  vendor: 'Test Vendor',
  items: [{ name: 'Item 1', cost: '10.00' }],
  tax: 10.0,
  total: 100.0,
  imageUrl: '',
};
