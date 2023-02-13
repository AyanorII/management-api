import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateOrderItemDto } from '../../order-items/dto/create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
