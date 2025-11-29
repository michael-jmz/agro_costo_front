import { Fase } from './fase.interface';

export interface Cultivo {
  id: number;
  nombre: string;
  fases: Fase[];
}
