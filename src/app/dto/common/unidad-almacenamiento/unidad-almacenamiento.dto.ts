import { EstadoUnidad } from '../../enum/estado-unidad';

export interface unidadAlmacenamientoDto {
  largo: number;
  ancho: number;
  alto: number;
  volumenOcupado: number;
  estadoUnidad: EstadoUnidad;
  volumenTotal: number;
  volumenDisponible: number;
  porcentajeOcupacion: number;
}
