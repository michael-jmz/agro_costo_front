import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Cultivo } from '../interfaces/cultivo.interface';
import { Fase } from '../interfaces/fase.interface';

@Injectable({ providedIn: 'root' })
export class CultivoService {

  private hectareasSubject = new BehaviorSubject<number>(1);
  hectareas$ = this.hectareasSubject.asObservable();

  private cultivoSubject = new BehaviorSubject<Cultivo | null>(null);
  cultivo$ = this.cultivoSubject.asObservable();

  constructor() {
    // Cargamos por defecto Maíz
    const maiz = this.crearCultivoMaiz();
    this.recalcularFases(maiz.fases);
    this.cultivoSubject.next(maiz);
  }

  setHectareas(valor: number) {
    if (valor <= 0) valor = 1;
    this.hectareasSubject.next(valor);
  }

  private crearCultivoMaiz(): Cultivo {
    const siembra: Fase = {
      id: 1,
      nombre: 'Siembra',
      dias: 63,
      actividades: [
        { id: 1, nombre: 'Desbroce del monte', unidad: 'ha', costo: 100, activa: true, completada: true },
        { id: 2, nombre: 'Quema de maleza', unidad: 'ha', costo: 20, activa: true, completada: true },
        { id: 3, nombre: 'Selección de semilla', unidad: 'ha', costo: 180, activa: true, completada: true },
        { id: 4, nombre: 'Aplicación de herbicida', unidad: 'ha', costo: 115, activa: true, completada: true },
        { id: 5, nombre: 'Desinfección de semilla', unidad: 'ha', costo: 20, activa: true, completada: true },
        { id: 6, nombre: 'Siembra', unidad: 'ha', costo: 214, activa: true, completada: true },
      ],
      costoTotal: 0,
      progreso: 0
    };

    const cultivo: Fase = {
      id: 2,
      nombre: 'Cultivo',
      dias: 177,
      actividades: [
        { id: 7,  nombre: 'Primera fertilización', unidad: 'ha', costo: 23,  activa: true, completada: true },
        { id: 8,  nombre: 'Primer control de plagas', unidad: 'ha', costo: 175, activa: true, completada: true },
        { id: 9,  nombre: 'Primer control de enfermedades', unidad: 'ha', costo: 61, activa: true, completada: true },
        { id: 10, nombre: 'Aplicación de herbicida', unidad: 'ha', costo: 34, activa: true, completada: true },
        { id: 11, nombre: 'Segunda fertilización', unidad: 'ha', costo: 142, activa: true, completada: true },
        { id: 12, nombre: 'Segundo control de plagas', unidad: 'ha', costo: 100, activa: true, completada: true },
        { id: 13, nombre: 'Segundo control de enfermedades', unidad: 'ha', costo: 5,   activa: true, completada: true },
        { id: 14, nombre: 'Tercera fertilización', unidad: 'ha', costo: 142, activa: true, completada: true },
      ],
      costoTotal: 0,
      progreso: 0
    };

    const cosecha: Fase = {
      id: 3,
      nombre: 'Cosecha',
      dias: 5,
      actividades: [
        { id: 15, nombre: 'Recolectado', unidad: 'ha', costo: 80,   activa: true, completada: true },
        { id: 16, nombre: 'Amontonado', unidad: 'ha', costo: 20,   activa: true, completada: true },
        { id: 17, nombre: 'Desgranado', unidad: 'ha', costo: 4.5,  activa: true, completada: true },
        { id: 18, nombre: 'Alquiler desgranadora', unidad: 'ha', costo: 37.5, activa: true, completada: true },
        { id: 19, nombre: 'Ensacado y almacenamiento', unidad: 'ha', costo: 26, activa: true, completada: true },
        { id: 20, nombre: 'Control y tratamiento del maíz', unidad: 'ha', costo: 45, activa: true, completada: true },
        { id: 21, nombre: 'Venta', unidad: 'ha', costo: 0, activa: true, completada: true },
      ],
      costoTotal: 0,
      progreso: 0
    };

    return {
      id: 1,
      nombre: 'Maíz',
      fases: [siembra, cultivo, cosecha]
    };
  }

  // Recalcula costoTotal y progreso de cada fase
  recalcularFases(fases: Fase[]) {

  fases.forEach(f => {

    const totalCostosActivos = f.actividades
      .filter(a => a.activa)
      .reduce((sum, a) => sum + a.costo, 0);

    const totalCompletado = f.actividades
      .filter(a => a.activa && a.completada)
      .reduce((sum, a) => sum + a.costo, 0);

    // 🔥 ACTUALIZAR COSTO TOTAL
    f.costoTotal = totalCostosActivos;

    // 🔥 ACTUALIZAR PROGRESO PONDERADO
    f.progreso = totalCostosActivos === 0
      ? 0
      : Math.round((totalCompletado / totalCostosActivos) * 100);

    // 🔥 ACTUALIZAR PORCENTAJE DE CADA ACTIVIDAD
    f.actividades.forEach(a => {
      if (!a.activa || totalCostosActivos === 0) {
        a.porcentaje = 0;
      } else {
        a.porcentaje = +((a.costo / totalCostosActivos) * 100).toFixed(2);
      }
    });

  });

}


  actualizarFase(faseActualizada: Fase) {
    const cultivo = this.cultivoSubject.value;
    if (!cultivo) { return; }
    const index = cultivo.fases.findIndex(f => f.id === faseActualizada.id);
    cultivo.fases[index] = faseActualizada;
    this.recalcularFases(cultivo.fases);
    this.cultivoSubject.next({ ...cultivo });
  }

  obtenerCostoTotal1Ha(): number {
    const cultivo = this.cultivoSubject.value;
    if (!cultivo) return 0;
    return cultivo.fases.reduce((s, f) => s + f.costoTotal, 0);
  }

  obtenerProgresoGlobal(): number {
  const cultivo = this.cultivoSubject.value;

  if (!cultivo || !cultivo.fases.length) return 0;

  const totalValor = cultivo.fases
    .reduce((sum, f) => sum + (f.costoTotal || 0), 0);

  if (totalValor === 0) return 0;

  const totalCompletado = cultivo.fases
    .reduce((sum, f) =>
      sum + ((f.costoTotal || 0) * (f.progreso || 0) / 100),
    0);

  return Number(((totalCompletado / totalValor) * 100).toFixed(2));
}

progresoGlobal$ = this.cultivo$.pipe(
    map(cultivo => {
      if (!cultivo || !cultivo.fases.length) return 0;

      const totalValor = cultivo.fases.reduce((s, f) => s + f.costoTotal, 0);
      if (totalValor === 0) return 0;

      const totalCompletado = cultivo.fases
        .reduce((s, f) => s + (f.costoTotal * f.progreso / 100), 0);

      return Number(((totalCompletado / totalValor) * 100).toFixed(2));
    })
  );

}
