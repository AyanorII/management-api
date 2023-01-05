import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CreateVendorProductDto } from './dto/create-vendor-product.dto';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorProductsService } from './vendor-products.service';
import { VendorsService } from './vendors.service';
import { UpdateVendorProductDto } from './dto/update-vendor-product.dto';

@ApiBearerAuth()
@ApiTags('Vendors')
@Controller('vendors')
@UseGuards(JwtGuard)
export class VendorsController {
  constructor(
    private readonly vendorsService: VendorsService,
    private readonly vendorProductsService: VendorProductsService
  ) {}

  @Post()
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorsService.create(createVendorDto);
  }

  @Get()
  findAll() {
    return this.vendorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorsService.update(+id, updateVendorDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorsService.remove(+id);
  }

  @Post(':id/products')
  addProduct(
    @Param('id') id: string,
    @Body() createVendorProductDto: CreateVendorProductDto,
  ) {
    return this.vendorProductsService.create(+id, createVendorProductDto);
  }

  @Patch(':id/products/:vendorProductId')
  updateProduct(
    @Param('id') id: number,
    @Param('vendorProductId') vendorProductId: number,
    @Body() updateVendorProductDto: UpdateVendorProductDto,
  ) {
    return this.vendorProductsService.update(
      vendorProductId,
      updateVendorProductDto,
    );
  }
}
