import { ItemCarritoDto } from './item-carrito.dto';

export interface CarritoCompraDto {
  id: number;
  idCliente: number;
  totalValor: number;
  itemsCarrito: ItemCarritoDto[];
}
