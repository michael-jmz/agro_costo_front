export interface Actividad {
  id: number;
  nombre: string;
  unidad: string;   // ha, jornal, %
  costo: number;    // valor monetario
  activa: boolean;
  completada: boolean;
  porcentaje?: number;
  editando?: boolean;
  esNueva?: boolean;
  tipoCosto?: 'CF' | 'CV';
  costoTotal?: number; // costo * hectareas (solo lectura)

}
