import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '../common/decorators/get-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.ordersService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @GetUser() user: User) {
    return this.ordersService.findOne(id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @GetUser() user: User) {
    return this.ordersService.remove(id, user);
  }
}
