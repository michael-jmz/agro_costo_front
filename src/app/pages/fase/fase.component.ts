import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Actividad } from '../interfaces/actividad.interface';
import { Fase } from '../interfaces/fase.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgresoRadialComponent } from '../../progreso-radial/progreso-radial.component';

@Component({
  selector: 'app-fase',
  imports: [CommonModule, FormsModule, ProgresoRadialComponent ],
  templateUrl: './fase.component.html',
  styleUrl: './fase.component.css'
})
export class FaseComponent {
  @Input() fase!: Fase;
  @Output() faseActualizada = new EventEmitter<Fase>();

  ngOnInit() {
    //Al entrar al componente ya calcula porcentajes
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
    nombre: '',
    unidad: 'ha',
    costo: 0,
    activa: true,
    completada: false,
    esNueva: true
  };

  this.fase.actividades.push(nueva);
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

  confirmarNombre(actividad: Actividad) {
  if (!actividad.nombre || actividad.nombre.trim() === '') {
    actividad.nombre = 'Actividad nueva';
  }

  actividad.editando = false;
  this.actualizarActividad();
}

editarNombre(actividad: Actividad) {
  actividad.editando = true;
}
confirmarNuevaActividad(actividad: Actividad) {
  if (!actividad.nombre || actividad.nombre.trim() === '') {
    actividad.nombre = 'Actividad sin nombre';
  }

  actividad.esNueva = false;

  // ✅ AHORA sí recalcula
  this.recalcularFase();
}




}
