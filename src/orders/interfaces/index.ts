import { CreateOrderItemDto } from '../../order-items/dto/create-order-item.dto';
export interface IOrderItem extends CreateOrderItemDto {
  cost: number;
  subtotal: number;
}
