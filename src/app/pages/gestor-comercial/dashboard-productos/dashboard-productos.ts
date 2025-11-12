import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/inventario/dashboard.service';
import { ResumenDashboardDto } from '../../../dto/objects/inventario/producto/resumen-dashboard.dto';
import { ProductoDashBoardDto } from '../../../dto/objects/inventario/producto/producto-dashboard.dto';
import { MensajeDto } from '../../../dto/common/mensajeDto.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-dashboard-productos',
  imports: [CommonModule, NgIf],
  templateUrl: './dashboard-productos.html',
  styleUrl: './dashboard-productos.css',
})
export class DashboardProductosComponent implements OnInit {
  resumenDashboard?: ResumenDashboardDto;
  cargando: boolean = true;
  errorMensaje: string = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.obtenerResumen();
  }

  // Fetch dashboard data from backend / Obtener los datos del dashboard desde el backend
  private obtenerResumen(): void {
    this.dashboardService.obtenerResumenProductos().subscribe({
      next: (respuesta: MensajeDto<ResumenDashboardDto>) => {
        this.resumenDashboard = respuesta.mensaje;
        this.cargando = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMensaje = error.error?.mensaje || 'Error al cargar el resumen del dashboard';
        this.cargando = false;
      },
    });
  }
}
