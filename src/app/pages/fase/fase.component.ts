import { Component, EventEmitter, Input, Output, SimpleChanges  } from '@angular/core';
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
  @Input() hectareas: number = 1;
  @Output() faseActualizada = new EventEmitter<Fase>();

  ngOnInit() {
    //Al entrar al componente ya calcula porcentajes
    this.recalcularFase();
  }
  ngOnChanges(changes: SimpleChanges) {
  if (changes['hectareas']) {
    this.recalcularFase();
  }
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
   this.recalcularFase();     // 🔥 recalcula fase
  this.emitirCambio();
}



 private recalcularFase() {
  const actividades = this.fase.actividades;

  const totalCostosActivos = actividades
    .filter(a => a.activa)
    .reduce((sum, a) => sum + (a.costo || 0), 0);

  const totalCompletado = actividades
    .filter(a => a.activa && a.completada)
    .reduce((sum, a) => sum + (a.costo || 0), 0);

  this.fase.costoTotal = totalCostosActivos;

  this.fase.progreso = totalCostosActivos === 0
    ? 0
    : Math.round((totalCompletado / totalCostosActivos) * 100);

  actividades.forEach(a => {
    a.porcentaje = (!a.activa || totalCostosActivos === 0)
      ? 0
      : +((a.costo / totalCostosActivos) * 100).toFixed(2);

    a.costoTotal = a.activa ? a.costo * this.hectareas : 0;
  });

  this.fase.costoTotalHectareas = this.fase.costoTotal * this.hectareas;

  // 🔥 ESTO ES LO QUE FALTABA
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

  // AHORA sí recalcula
  this.recalcularFase();

  this.emitirCambio();
}
getImagenFase(nombre: string): string {
  switch (nombre) {
    case 'Siembra':
      return 'siembra.jpeg';
    case 'Labores culturales':
    case 'Cultivo':
      return 'cultural.jpeg';
    case 'Cosecha':
      return 'cosecha.jpeg';
    default:
      return 'image.png';
  }
}





}
