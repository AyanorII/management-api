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
import { User } from '@prisma/client';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CreateVendorProductDto } from './dto/create-vendor-product.dto';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorProductDto } from './dto/update-vendor-product.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorProductsService } from './vendor-products.service';
import { VendorsService } from './vendors.service';

@ApiBearerAuth()
@ApiTags('Vendors')
@Controller('vendors')
@UseGuards(JwtGuard)
export class VendorsController {
  constructor(
    private readonly vendorsService: VendorsService,
    private readonly vendorProductsService: VendorProductsService,
  ) {}

  @Post()
  create(@Body() createVendorDto: CreateVendorDto, @GetUser() user: User) {
    return this.vendorsService.create(createVendorDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.vendorsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @GetUser() user: User) {
    return this.vendorsService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateVendorDto: UpdateVendorDto,
    @GetUser() user: User,
  ) {
    return this.vendorsService.update(id, updateVendorDto, user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: number, @GetUser() user: User) {
    return this.vendorsService.remove(id, user);
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
