import { TipoProducto } from '../../../enum/tipo-producto';

export interface RegistroProductoDto {
  codigoBarras: string;
  nombre: string;
  valorCompra: number;
  tipoProducto: TipoProducto;
  idProveedor: number;
  imagenProducto?: File;
}
