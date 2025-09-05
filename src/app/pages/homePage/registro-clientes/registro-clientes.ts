import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CrearClienteDto } from '../../../dto/homePage/registro/crear-cliente.dto';
import { TipoCliente } from '../../../dto/homePage/registro/tipo-cliente.enum';
import { UbicacionDto } from '../../../dto/common/ubicacion.dto';
import { UbicacionService } from './services/ubicacion.service';
import { TelefonoService } from './services/telefono.service';
import intlTelInput from 'intl-tel-input';

@Component({
  selector: 'app-registro-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-clientes.html',
  styleUrl: './registro-clientes.css',
})
export class RegistroClientes implements AfterViewInit {
  esClienteNatural: boolean = true;
  formNatural: FormGroup;
  formJuridico: FormGroup;
  ubicacionActual: UbicacionDto | null = null;
  mostrarPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ubicacionService: UbicacionService,
    private telefonoService: TelefonoService
  ) {
    // Cliente Natural
    this.formNatural = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required], // se acopla al nombre completo en el DTO
      telefono: [undefined, Validators.required],
      telefonoSecundario: [undefined],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    // Cliente Jurídico
    this.formJuridico = this.fb.group({
      nombre: ['', Validators.required], // representante legal
      telefono: [undefined, Validators.required],
      telefonoSecundario: [undefined],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      nit: ['', Validators.required],
    });
  }

  cambiarTipo(tipo: 'NATURAL' | 'JURIDICO') {
    this.esClienteNatural = tipo === 'NATURAL';

    // Espera a que Angular pinte el nuevo formulario y aplica intl-tel-input
    setTimeout(() => {
      this.inicializarTelefonos();
    });
  }

  private inicializarTelefonos() {
    const ids = ['telNatural', 'telNaturalSec', 'telJuridico', 'telJuridicoSec'];
    for (const id of ids) {
      const input = document.querySelector<HTMLInputElement>(`#${id}`);
      if (input) {
        intlTelInput(input, {
          initialCountry: 'co',
          preferredCountries: ['co', 'us', 'gb', 'ca', 'mx', 'fr'],
          separateDialCode: true,
        } as any);
      }
    }
  }

  async obtenerUbicacion() {
    try {
      this.ubicacionActual = await this.ubicacionService.obtenerUbicacionActual();

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Posición obtenida:', position);
        },
        (error) => {
          console.error('Error al obtener la posición:', error);
          alert('Error al obtener la posición. Asegúrate de haber dado permiso.');
        }
      );
      console.log('Ubicación obtenida:', this.ubicacionActual);
    } catch (error) {
      alert(error);
    }
  }

  // Alterna visibilidad de la contraseña
  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  ngAfterViewInit() {
    // Cliente Natural
    const inputNatural = document.querySelector<HTMLInputElement>('#telNatural');
    if (inputNatural) {
      intlTelInput(inputNatural, {
        initialCountry: 'co',
        preferredCountries: ['co', 'us', 'gb', 'ca', 'mx', 'fr'],
        separateDialCode: true,
      } as any);
    }

    const inputNaturalSec = document.querySelector<HTMLInputElement>('#telNaturalSec');
    if (inputNaturalSec) {
      intlTelInput(inputNaturalSec, {
        initialCountry: 'co',
        preferredCountries: ['co', 'us', 'gb', 'ca', 'mx', 'fr'],
        separateDialCode: true,
      } as any);
    }

    // Cliente Jurídico
    const inputJuridico = document.querySelector<HTMLInputElement>('#telJuridico');
    if (inputJuridico) {
      intlTelInput(inputJuridico, {
        initialCountry: 'co',
        preferredCountries: ['co', 'us', 'gb', 'ca', 'mx', 'fr'],
        separateDialCode: true,
      } as any);
    }

    const inputJuridicoSec = document.querySelector<HTMLInputElement>('#telJuridicoSec');
    if (inputJuridicoSec) {
      intlTelInput(inputJuridicoSec, {
        initialCountry: 'co',
        preferredCountries: ['co', 'us', 'gb', 'ca', 'mx', 'fr'],
        separateDialCode: true,
      } as any);
    }
  }

  onSubmit() {
    if (!this.ubicacionActual) {
      alert('Debes dar permiso de ubicación antes de registrar.');
      return;
    }

    let dto: CrearClienteDto;

    if (this.esClienteNatural && this.formNatural.valid) {
      dto = {
        nombre: this.formNatural.value.nombre + ' ' + this.formNatural.value.apellido,
        telefono: this.telefonoService.obtenerNumero('telNatural') ?? '',
        codigoPais: this.telefonoService.obtenerCodigoPais('telNatural') ?? '',
        telefonoSecundario: this.telefonoService.obtenerNumero('telNaturalSec') ?? '',
        codigoPaisSecundario: this.telefonoService.obtenerCodigoPais('telNaturalSec') ?? '',
        user: {
          email: this.formNatural.value.email,
          password: this.formNatural.value.password,
        },
        ubicacion: this.ubicacionActual,
        tipoCliente: TipoCliente.NATURAL,
      };
      console.log('Cliente Natural DTO:', dto);
    } else if (!this.esClienteNatural && this.formJuridico.valid) {
      dto = {
        nombre: this.formJuridico.value.nombre,
        telefono: this.telefonoService.obtenerNumero('telJuridico') ?? '',
        codigoPais: this.telefonoService.obtenerCodigoPais('telJuridico') ?? '',
        telefonoSecundario: this.telefonoService.obtenerNumero('telJuridicoSec') ?? '',
        codigoPaisSecundario: this.telefonoService.obtenerCodigoPais('telJuridicoSec') ?? '',
        user: {
          email: this.formJuridico.value.email,
          password: this.formJuridico.value.password,
        },
        ubicacion: this.ubicacionActual,
        tipoCliente: TipoCliente.JURIDICO,
        nit: this.formJuridico.value.nit,
      };
      console.log('Cliente Jurídico DTO:', dto);
    } else {
      console.log('Formulario inválido');
    }
  }
}
