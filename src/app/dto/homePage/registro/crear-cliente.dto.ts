import { CrearUserDto } from '../../common/crear-user.dto';
import { UbicacionDto } from '../../common/ubicacion.dto';
import { TipoCliente } from './tipo-cliente.enum';

export interface CrearClienteDto {
  // Campos para Cliente Natural
  nombre: string;
  telefono: string;
  codigoPais: string;

  telefonoSecundario?: string; // Aplica si el cliente lo desea
  codigoPaisSecundario?: string;

  user: CrearUserDto;
  ubicacion: UbicacionDto;
  tipoCliente: TipoCliente;

  // Campos para Cliente Jurídico
  nit?: string; // Aplica solo para clientes jurídicos
}
