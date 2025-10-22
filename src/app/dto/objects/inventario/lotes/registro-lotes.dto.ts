export interface RegistroLoteDto {
  fechaVencimiento?: string;
  cantidadTotal: number;
  areaTotal: number;
  idEspacioProducto: number;
  idGestorComercial: number | null;
  fechaEntra: string;
  observaciones?: string;
}
