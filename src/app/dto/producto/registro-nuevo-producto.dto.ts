export interface RegistroNuevoProductoDto {
  codigoProducto: string;
  nombre: string;
  cantidad: number;
  descripcion: string;
  tipoProducto: string;
  idBodega: string;
  emailPersonalBodega: string;
  descripcionMovimiento?: string;
  imagenProducto: File; // obligatorio en el backend
}
