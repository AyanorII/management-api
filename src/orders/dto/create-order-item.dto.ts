import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty()
  @IsNumber()
  vendorProductId: number;
}
