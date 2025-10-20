import { TipoProducto } from '../../../enum/tipo-producto';

export interface ProductoDto {
  id: number;
  codigoBarras: string;
  nombre: string;
  valorCompra: number;
  valorVenta: number;
  imagen: string;
  tipoProducto: TipoProducto;
  idProveedor: number;
}
