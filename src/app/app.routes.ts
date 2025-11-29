import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'cultivo',
    loadComponent : ()=> import ('./pages/selector-cultivo/selector-cultivo.component'),


  //   children: [

  //     {
  //       path: 'costo_cultivo',
  //       loadComponent: ()=> import ('./pages/costos-cultivo/costos-cultivo.component')
  //     },
  //     //  rutas hijas
  //     {
  //       path: '**',
  //       redirectTo: 'costo_cultivo'
  // }

  //   ],
  },

  {
    path: 'costo_cultivo',
    loadComponent: ()=> import ('./pages/costos-cultivo/costos-cultivo.component')
  },
  // Aqui definimos rutas

  {
    path: '**',
    redirectTo: 'cultivo'
  }
];
