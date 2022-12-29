import { Test, TestingModule } from '@nestjs/testing';
import { VendorProductsService } from './vendor-products.service';

describe('VendorProductsService', () => {
  let provider: VendorProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendorProductsService],
    }).compile();

    provider = module.get<VendorProductsService>(VendorProductsService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
