import { Body, Controller, Get, Post, UseGuards, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../common/decorators/get-user.decorator';
import { JwtGuard } from '../common/guards/jwt.guard';
import { UserDocument } from '../users/schemas/user.schema';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { VendorsService } from './vendors.service';

@ApiBearerAuth()
@ApiTags('Vendors')
@Controller('vendors')
@UseGuards(JwtGuard)
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  create(
    @Body() createVendorDto: CreateVendorDto,
    @GetUser() user: UserDocument,
  ) {
    return this.vendorsService.create({ ...createVendorDto, userId: user.id });
  }

  @Get()
  findAll(@GetUser() user: UserDocument) {
    return this.vendorsService.findAll({ userId: user.id });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: UserDocument) {
    return this.vendorsService.findOne({ id, userId: user.id });
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: number,
  //   @Body() updateVendorDto: UpdateVendorDto,
  //   @GetUser() user: User,
  // ) {
  //   return this.vendorsService.update(id, updateVendorDto, user);
  // }

  // @HttpCode(HttpStatus.NO_CONTENT)
  // @Delete(':id')
  // remove(@Param('id') id: number, @GetUser() user: User) {
  //   return this.vendorsService.remove(id, user);
  // }

  // /* ---------------------------- Vendor Products --------------------------- */
  // @Post(':id/products')
  // addProduct(
  //   @Param('id') id: number,
  //   @Body() createVendorProductDto: CreateVendorProductDto,
  //   @GetUser() user: User,
  // ) {
  //   return this.vendorProductsService.create(id, createVendorProductDto, user);
  // }

  // @Get(':id/products/:vendorProductId')
  // getProduct(
  //   @Param('id') _id: number,
  //   @Param('vendorProductId') vendorProductId: number,
  //   @GetUser() user: User,
  // ) {
  //   return this.vendorProductsService.findOne(vendorProductId, user);
  // }

  // @Patch(':id/products/:vendorProductId')
  // updateProduct(
  //   @Param('id') id: number,
  //   @Param('vendorProductId') vendorProductId: number,
  //   @GetUser() user: User,
  //   @Body() updateVendorProductDto: UpdateVendorProductDto,
  // ) {
  //   return this.vendorProductsService.update(
  //     vendorProductId,
  //     updateVendorProductDto,
  //     user,
  //   );
  // }
  // /* ---------------------------- Vendor Products --------------------------- */

  // /* -------------------------------- Orders -------------------------------- */
  // @Post(':id/orders')
  // createOrder(
  //   @Param('id') id: number,
  //   @Body() createOrderDto: CreateOrderDto,
  //   @GetUser() user: User,
  // ) {
  //   return this.ordersService.create(id, createOrderDto, user);
  // }

  // @Get()
  // getOrders(@GetUser() user: User) {
  //   return this.ordersService.findAll(user);
  // }

  // @Get(':id')
  // getOneOrder(@Param('id') id: number, @GetUser() user: User) {
  //   return this.ordersService.findOne(id, user);
  // }

  // @Delete(':id')
  // deleteOrder(@Param('id') id: number, @GetUser() user: User) {
  //   return this.ordersService.remove(id, user);
  // }
  // /* -------------------------------- Orders -------------------------------- */
}
