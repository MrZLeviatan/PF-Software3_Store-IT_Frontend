export interface AutorizacionProductoDto {
  codigoProducto: string; // Código del producto
  idMovimiento: string; // ID del movimiento a autorizar
  emailPersonalAutorizado: string; // Email del personal autorizado
  descripcionAutorizacion?: string; // Campo opcional
  estadoMovimiento: string; // Enum en backend, aquí como string
}
