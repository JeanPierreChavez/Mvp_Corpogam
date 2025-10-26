import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dash-prueba',
  standalone: true,   // 👈 si estás usando standalone
  imports: [FormsModule, NgIf],
  templateUrl: './dash-prueba.html',
  styleUrl: './dash-prueba.css'
})
export class DashPrueba {
  // Aquí guardamos el modo seleccionado
  modoSeleccionado: string = 'formulario';  // por defecto formulario
}
