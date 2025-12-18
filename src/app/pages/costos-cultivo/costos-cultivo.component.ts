import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaseComponent } from '../fase/fase.component';
import { Fase } from '../interfaces/fase.interface';
import { Subscription } from 'rxjs';
import { CultivoService } from '../services/services.service';
import { ProgresoRadialComponent } from '../../progreso-radial/progreso-radial.component';


@Component({
  selector: 'pages-costos-cultivo',
  imports: [CommonModule, FormsModule, FaseComponent, ProgresoRadialComponent],
  templateUrl: './costos-cultivo.component.html',
  styleUrl: './costos-cultivo.component.css',
  standalone: true,
})
export default class CostosCultivoComponent implements OnDestroy {

  fases: Fase[] = [];
  hectareas = 1;
  costo1Ha = 0;
  costoTotal = 0;
  progresoGlobal = 0;
  quintalesHa = 150;
  margenError = 0.08;
  costoPorQuintal = 0;


  private subCultivo?: Subscription;
  private subHectareas?: Subscription;


  constructor(private cultivoService: CultivoService) {
    this.subCultivo = this.cultivoService.cultivo$.subscribe(c => {
      if (!c) { return; }
      this.fases = c.fases;
      this.actualizarResumen();
    });
    this.subHectareas = this.cultivoService.hectareas$.subscribe(h => {
      this.hectareas = h;
      this.actualizarResumen();
    });
  }
  ngOnInit() {
  this.cultivoService.quintalesHa$.subscribe(v => this.quintalesHa = v);
  this.cultivoService.margenError$.subscribe(v => this.margenError = v);
  this.cultivoService.costoPorQuintal$.subscribe(v => this.costoPorQuintal = v);
}


  cambiarHectareas(valor: number) {
    this.cultivoService.setHectareas(valor);
  }

  onFaseActualizada(fase: Fase) {
    this.cultivoService.actualizarFase(fase);
    this.actualizarResumen();
  }

  actualizarResumen() {
  // costo por 1 hectárea (ya correcto)
  this.costo1Ha = this.cultivoService.obtenerCostoTotal1Ha();

  // costo total según hectáreas
  this.costoTotal = this.costo1Ha * this.hectareas;

  // progreso global
  this.progresoGlobal = this.cultivoService.obtenerProgresoGlobal();

  //quintales tales
  const quintalesTotales = this.quintalesHa * this.hectareas;

  // costo por quintal
  this.costoPorQuintal = quintalesTotales > 0
    ? this.costoTotal / quintalesTotales
    : 0;
}




  ngOnDestroy() {
    this.subCultivo?.unsubscribe();
    this.subHectareas?.unsubscribe();
  }

  cambiarQuintalesHa(valor: number) {
  this.cultivoService.setQuintalesHa(valor);
}

cambiarMargen(valor: number) {
  this.cultivoService.setMargenError(valor);
}





}
