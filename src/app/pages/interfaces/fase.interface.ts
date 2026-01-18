import { Actividad } from './actividad.interface';

export interface Fase {
  id: number;
  nombre: string;
  dias: number;
  actividades: Actividad[];
  progreso: number;
  costoTotal: number;
  costoTotalHectareas?: number;
}
