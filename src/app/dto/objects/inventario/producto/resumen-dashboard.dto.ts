import { ProductoDashBoardDto } from './producto-dashboard.dto';

export interface ResumenDashboardDto {
  productoMasVendido: ProductoDashBoardDto;
  productoConMasUnidades: ProductoDashBoardDto;
  productoConMenosUnidades: ProductoDashBoardDto;
}
