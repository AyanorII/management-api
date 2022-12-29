import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty()
  @ValidateIf((product: CreateProductDto) => !product.vendorProductId)
  @IsNumber()
  @Min(0)
  cost: number;

  @ApiProperty()
  @IsNumber()
  categoryId: number;

  @ApiProperty()
  @IsNumber()
  @ValidateIf((product: CreateProductDto) => !product.cost)
  vendorProductId: number;
}
