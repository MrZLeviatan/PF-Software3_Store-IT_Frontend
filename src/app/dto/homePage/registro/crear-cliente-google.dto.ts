import { UbicacionDto } from '../../common/ubicacion.dto';

export interface CrearClienteGoogleDto {
  nombre: string;
  telefono: string;
  codigoPais: string;

  telefonoSecundario?: string; // Aplica si el cliente lo desea
  codigoPaisSecundario?: string;
  email: string;
  password: string;
  ubicacion: UbicacionDto;
}
