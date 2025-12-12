import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Actividad } from '../interfaces/actividad.interface';
import { Fase } from '../interfaces/fase.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fase',
  imports: [CommonModule, FormsModule],
  templateUrl: './fase.component.html',
  styleUrl: './fase.component.css'
})
export class FaseComponent {
  @Input() fase!: Fase;
  @Output() faseActualizada = new EventEmitter<Fase>();
  ngOnInit() {
    // 👌 Al entrar al componente ya calcula porcentajes
    this.recalcularFase();
  }


  onCambio() {
    this.recalcularFase();
    this.faseActualizada.emit(this.fase);
  }
  actualizarActividad() {
     // Este método ahora también llamará a recalcularFase
    this.recalcularFase();
  }

  eliminarActividad(id: number) {
    this.fase.actividades = this.fase.actividades.filter(a => a.id !== id);
    this.actualizarActividad();
  }

  agregarActividad() {
    const nueva: Actividad = {
      id: Date.now(),
      nombre: 'Nueva actividad',
      unidad: 'ha',
      costo: 0,
      activa: true,
      completada: false
    };

    // Agregar la nueva actividad a la fase
    this.fase.actividades.push(nueva);

    // Recalcular la fase después de agregar la actividad
    this.recalcularFase();

    // Emitir los cambios
    this.faseActualizada.emit(this.fase);
  }

  private recalcularFase() {
  const actividades = this.fase.actividades;

  // Total de valor SOLO de actividades activas
  const totalValor = actividades
    .filter(a => a.activa)
    .reduce((sum, a) => sum + (a.costo || 0), 0);

  // Total completado ponderado
  const totalCompletado = actividades
    .filter(a => a.activa && a.completada)
    .reduce((sum, a) => sum + (a.costo || 0), 0);

  // Guardar costo total
  this.fase.costoTotal = totalValor;

  // Calcular porcentaje ponderado
  this.fase.progreso = totalValor === 0
    ? 0
    : Math.round((totalCompletado / totalValor) * 100);

  // Calcular porcentaje individual de cada actividad
  actividades.forEach(a => {
    if (!a.activa || totalValor === 0) {
      a.porcentaje = 0;
    } else {
      a.porcentaje = Number(((a.costo / totalValor) * 100).toFixed(2));
    }
  });

  this.faseActualizada.emit(this.fase);
}


  emitirCambio() {
  this.faseActualizada.emit(this.fase);
}

calcularProgreso() {
    const activas = this.fase.actividades.filter(a => a.activa);
    const completadas = activas.filter(a => a.completada);

    if (activas.length === 0) {
      this.fase.progreso = 0;
      return;
    }

    this.fase.progreso = Math.round((completadas.length / activas.length) * 100);
  }


}
