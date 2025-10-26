import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vacunas',
  imports: [],
  templateUrl: './vacunas.html',
  styleUrl: './vacunas.scss'
})
export class Vacunas {

  constructor( private router: Router){}
      irRegistro() {
    this.router.navigate(['/registro']);
  }

  irAnimales() {
    this.router.navigate(['/animales']);
  }

  irVacunas() {
    this.router.navigate(['/vacunas']);
  }
  riInicio(){
    this.router.navigate(['/dashboard']);
  }
   irSemaforo(){
    this.router.navigate(['/semaforo']);
  


  }
   //Hora y fecha actual
   
    nombreUsuario: string = 'Usuario'; // puedes reemplazarlo con el nombre real si lo tienes
  fechaActual: string = '';
  horaActual: string = '';

  private intervalId: any;

  ngOnInit(): void {
    this.actualizarFechaHora();
    // Actualiza cada segundo
    this.intervalId = setInterval(() => this.actualizarFechaHora(), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId); // limpia el intervalo cuando se destruye el componente
  }

  actualizarFechaHora(): void {
    const ahora = new Date();

    // Opciones para mostrar la fecha y hora en la zona horaria de Ecuador
    const opcionesFecha: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Guayaquil'
    };

    const opcionesHora: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'America/Guayaquil'
    };

    this.fechaActual = ahora.toLocaleDateString('es-EC', opcionesFecha);
    this.horaActual = ahora.toLocaleTimeString('es-EC', opcionesHora);
  }
  //Fin de la hora y fecha 
 



}
