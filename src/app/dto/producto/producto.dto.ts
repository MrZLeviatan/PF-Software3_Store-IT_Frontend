export interface ProductoDto {
  codigoProducto: string;
  nombre: string;
  cantidad: number;
  descripcion: string;
  tipoProducto: string;
  estadoProducto?: string;
  idBodega?: string;
  imagen?: string;
}
