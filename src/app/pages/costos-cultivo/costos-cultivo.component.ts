import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FaseComponent } from '../fase/fase.component';
import { Fase } from '../interfaces/fase.interface';
import { Subscription } from 'rxjs';
import { CultivoService } from '../services/services.service';


@Component({
  selector: 'pages-costos-cultivo',
  imports: [CommonModule, FormsModule, FaseComponent],
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


  cambiarHectareas(valor: number) {
    this.cultivoService.setHectareas(valor);
  }

  onFaseActualizada(fase: Fase) {
    this.cultivoService.actualizarFase(fase);
    this.actualizarResumen();
  }

  actualizarResumen() {
    this.costo1Ha = this.cultivoService.obtenerCostoTotal1Ha();
    this.costoTotal = this.costo1Ha * this.hectareas;
    this.progresoGlobal = this.cultivoService.obtenerProgresoGlobal();
  }



  ngOnDestroy() {
    this.subCultivo?.unsubscribe();
    this.subHectareas?.unsubscribe();
  }


}
