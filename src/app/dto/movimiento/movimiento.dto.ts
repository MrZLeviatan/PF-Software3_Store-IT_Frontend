export interface MovimientosProductoDto {
  id: number; // Identificador único
  descripcion: string; // Descripción del movimiento
  tipoMovimiento: string; // Enum en backend, aquí como string
  fechaMovimiento: string; // LocalDateTime → string (ISO 8601)
  fechaAutorizacion: string; // LocalDateTime → string (ISO 8601)
  cantidad: number;
  descripcionAutorizado: string; // Texto adicional sobre la autorización
  idProducto: string; // Identificador del producto
  emailPersonalResponsable: string; // ID del responsable
  emailPersonalAutorizado: string; // ID del autorizado
  isVerificado: boolean;
}
