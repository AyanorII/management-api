import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { VendorProductsService } from './vendor-products.service';

describe('VendorProductsService', () => {
  let provider: VendorProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VendorProductsService, PrismaService],
    }).compile();

    provider = module.get<VendorProductsService>(VendorProductsService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
