import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { UpdateOrderItemDto } from '../../order-items/dto/update-order-item.dto';

export class UpdateOrderDto {
  @ApiProperty()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => UpdateOrderItemDto)
  orderItems: UpdateOrderItemDto[];
}
