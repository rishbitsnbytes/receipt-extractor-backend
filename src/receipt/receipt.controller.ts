import { Controller, Post, Body } from '@nestjs/common';
import { ReceiptService } from './receipt.service';

@Controller('receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post('data-extraction')
  async extractData(@Body() data: any) {
    // return this.receiptService.extractData(data);
    return 'data extraction post wiring works';
  }
}
