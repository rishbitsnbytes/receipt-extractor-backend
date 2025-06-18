import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptService } from './receipt.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { GoogleDocumentAiProvider } from './providers/google-document-ai.provider';
import { mockExtractionData } from '../utils';

describe('ReceiptService', () => {
  let service: ReceiptService;
  let aiProvider: GoogleDocumentAiProvider;
  let receiptModel: any;

  const mockFile = {
    path: 'test/path/to/image.jpg',
    filename: 'image.jpg',
    mimetype: 'image/jpeg',
  } as Express.Multer.File;

  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

  beforeEach(async () => {
    aiProvider = {
      extractFromImage: jest.fn().mockResolvedValue(mockExtractionData),
    } as any;

    receiptModel = {
      create: jest.fn().mockImplementation((data) =>
        Promise.resolve({
          _id: { toString: () => 'mocked_id' },
          ...data,
        }),
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceiptService,
        {
          provide: ConfigService,
          useValue: { get: () => BASE_URL },
        },
        { provide: getModelToken('Receipt'), useValue: receiptModel },
        { provide: GoogleDocumentAiProvider, useValue: aiProvider },
      ],
    }).compile();

    service = module.get<ReceiptService>(ReceiptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should extract receipt details successfully from a valid image', async () => {
    const result = await service.extractReceiptDetails(mockFile);
    expect(aiProvider.extractFromImage).toHaveBeenCalledWith(mockFile.path);
    expect(receiptModel.create).toHaveBeenCalled();
    expect(result).toEqual({
      id: 'mocked_id',
      imageUrl: `${BASE_URL}/public/uploads/image.jpg`,
      date: mockExtractionData.date,
      currency: mockExtractionData.currency,
      vendor: mockExtractionData.vendor,
      items: mockExtractionData.items,
      tax: Number(mockExtractionData.tax),
      total: Number(mockExtractionData.total),
    });
  });

  it('should throw if file is not an image', async () => {
    const badFile = { ...mockFile, mimetype: 'application/pdf' };
    await expect(service.extractReceiptDetails(badFile)).rejects.toThrow(
      'Invalid file type',
    );
  });

  it('should handle invalid/empty AI response gracefully', async () => {
    (aiProvider.extractFromImage as jest.Mock).mockResolvedValueOnce({});
    const result = await service.extractReceiptDetails(mockFile);
    expect(result).toEqual({
      id: 'mocked_id',
      imageUrl: `${BASE_URL}/public/uploads/image.jpg`,
      date: null,
      currency: null,
      vendor: null,
      items: [],
      tax: null,
      total: null,
    });
  });

  it('should throw InternalServerError on provider error', async () => {
    const error = new Error('AI error');
    (aiProvider.extractFromImage as jest.Mock).mockRejectedValueOnce(error);
    await expect(service.extractReceiptDetails(mockFile)).rejects.toThrow(
      'AI error',
    );
  });
});
