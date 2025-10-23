import { RegistroUnidadAlmacenamientoDto } from './../../../common/unidad-almacenamiento/registro-unidad-almacenamiento.dto';

export interface RegistroEspacioProductoDto {
  unidadAlmacenamiento: RegistroUnidadAlmacenamientoDto;
  idSubBodega: number;
  idProducto: number;
  descripcion?: string;
  idGestor: number;
}
