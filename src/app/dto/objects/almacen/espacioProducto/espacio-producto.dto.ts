import { EstadoEspacio } from './../../../enum/estado-espacio';
import { unidadAlmacenamientoDto } from './../../../common/unidad-almacenamiento/unidad-almacenamiento.dto';

export interface EspacioProductoDto {
  id: number;
  unidadAlmacenamiento: unidadAlmacenamientoDto;
  idSubBodega: number;
  idProducto: number;
  cantidadTotal: number;
  estadoEspacio: EstadoEspacio;
}
