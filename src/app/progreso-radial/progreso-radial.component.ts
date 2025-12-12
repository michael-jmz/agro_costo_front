import { Component, Input, OnChanges } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexFill
} from 'ng-apexcharts';

@Component({
  selector: 'app-progreso-radial',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './progreso-radial.component.html',
  styleUrls: ['./progreso-radial.component.css']
})
export class ProgresoRadialComponent implements OnChanges {

  @Input() porcentaje = 0;

  /* =======================
     SERIES
  ======================= */
  series: ApexNonAxisChartSeries = [0];

  /* =======================
     CHART
  ======================= */
  chart: ApexChart = {
    type: 'radialBar',
    height: 120,
    sparkline: {
      enabled: true
    }
  };

  /* =======================
     OPCIONES RADIAL
  ======================= */
  plotOptions: ApexPlotOptions = {
    radialBar: {
      hollow: {
        size: '68%'
      },
      track: {
        background: '#EAEAEA'
      },
      dataLabels: {
        name: {
          show: false
        },
        value: {
          fontSize: '14px',
          fontWeight: 600,
          color: '#333',
          formatter: (val: number) => `${Math.round(val)}%`
        }
      }
    }
  };

  /* =======================
     COLOR DINÁMICO
  ======================= */
  fill: ApexFill = {
    colors: ['#5CB85C'] // verde por defecto
  };

  /* =======================
     ACTUALIZAR CUANDO CAMBIA %
  ======================= */
  ngOnChanges(): void {
    this.series = [this.porcentaje];
    this.fill = {
      colors: [this.obtenerColor()]
    };
  }

  /* =======================
     LÓGICA DE COLOR
  ======================= */
  private obtenerColor(): string {
    if (this.porcentaje < 50) {
      return '#D9534F'; //  rojo
    }
    if (this.porcentaje < 80) {
      return '#F0AD4E'; //  amarillo
    }
    return '#5CB85C';   //  verde
  }
}
