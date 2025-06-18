import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';
import { BadRequestException } from '@nestjs/common';
import { mockExtractionData } from '../utils';

describe('ReceiptController', () => {
  let controller: ReceiptController;
  let service: ReceiptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceiptController],
      providers: [
        {
          provide: ReceiptService,
          useValue: {
            extractReceiptDetails: jest
              .fn()
              .mockResolvedValue(mockExtractionData),
          },
        },
      ],
    }).compile();

    controller = module.get<ReceiptController>(ReceiptController);
    service = module.get<ReceiptService>(ReceiptService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service and return extraction data for valid file', async () => {
    const file = {
      filename: 'test.jpg',
      path: 'some/path',
      mimetype: 'image/jpeg',
    } as Express.Multer.File;
    const result = await controller.extractReceiptDetails(file);
    expect(service.extractReceiptDetails).toHaveBeenCalledWith(file);
    expect(result).toEqual(mockExtractionData);
  });

  it('should throw BadRequestException if file is missing', async () => {
    await expect(
      controller.extractReceiptDetails(undefined as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should propagate errors from the service', async () => {
    (service.extractReceiptDetails as jest.Mock).mockRejectedValueOnce(
      new Error('Service error'),
    );
    const file = {
      filename: 'test.jpg',
      path: 'some/path',
      mimetype: 'image/jpeg',
    } as Express.Multer.File;
    await expect(controller.extractReceiptDetails(file)).rejects.toThrow(
      'Service error',
    );
  });
});
