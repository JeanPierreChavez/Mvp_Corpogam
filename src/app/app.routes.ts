import { Routes } from '@angular/router';
import { Registro } from './registro/registro';
import { RegistroA } from './usuario/registro-a/registro-a';
import { Dashboard } from './dashboard/dashboard';
import { DashPrueba } from './dash-prueba/dash-prueba';
import { Animales } from './animales/animales';
import { Vacunas } from './vacunas/vacunas';
import { Semaforo } from './semaforo/semaforo';
import { FichaAnimales } from './ficha-animales/ficha-animales';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'registro', component: Registro },
  { path: 'registro_a', component: RegistroA },
  { path: 'dashboard', component: Dashboard },
  { path: 'pruebas', component: DashPrueba },
  { path: 'animales', component: Animales },
  { path: 'vacunas', component: Vacunas },
  { path: 'semaforo', component: Semaforo },
  { path: 'ficha-animal/:id_animal', component: FichaAnimales },
  { path: 'ficha-publica/:codigo_unico', component: FichaAnimales },
  { path: '**', redirectTo: '/dashboard' }
];