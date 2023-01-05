import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
  @IsNumber()
  vendorId: number;

  @ApiProperty()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
