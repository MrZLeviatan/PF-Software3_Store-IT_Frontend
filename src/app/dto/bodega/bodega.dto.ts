import { UbicacionDto } from './../common/ubicacion.dto';

export interface BodegaDto {
  id: string;
  ubicacion: UbicacionDto;
  direccion: string;
  telefono: string;
}
