import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimalService, Animal } from '../services/animal.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
 import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-animales',
  standalone: true,
  imports: [
    CommonModule, 
    ToastModule, 
    HttpClientModule, 
    ButtonModule
  ],
  providers: [
    AnimalService, 
    MessageService
  ],
  templateUrl: './animales.html',
  styleUrl: './animales.scss'
})
export class Animales implements OnInit, OnDestroy {
  animales: Animal[] = [];
  cargando: boolean = false;
  descargandoPDF: { [key: number]: boolean } = {};
  
  nombreUsuario: string = 'Usuario';
  fechaActual: string = '';
  horaActual: string = '';

  private intervalId: any;

  constructor(
    private animalService: AnimalService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.actualizarFechaHora();
    this.intervalId = setInterval(() => this.actualizarFechaHora(), 1000);
    this.cargarAnimales();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  actualizarFechaHora(): void {
    const ahora = new Date();

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

  cargarAnimales(): void {
    this.cargando = true;
    
    this.animalService.obtenerAnimales().subscribe({
      next: (data) => {
        this.animales = data;
        this.cargando = false;
        console.log('Animales cargados:', data);
      },
      error: (error) => {
        console.error('Error al cargar animales:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los animales'
        });
        this.cargando = false;
      }
    });
  }

  descargarFicha(animal: Animal): void {
    if (!animal.id_animal) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No se puede descargar la ficha de este animal'
      });
      return;
    }

    // ✅ Guardamos el ID en una constante para que TypeScript sepa que no es undefined
    const idAnimal = animal.id_animal;
    this.descargandoPDF[idAnimal] = true;

    this.animalService.descargarFichaPDF(idAnimal).subscribe({
      next: (blob) => {
        // Crear URL del blob
        const url = window.URL.createObjectURL(blob);
        
        // Crear elemento <a> temporal
        const a = document.createElement('a');
        a.href = url;
        a.download = `ficha_${animal.codigo_animal}_${animal.alias}.pdf`;
        document.body.appendChild(a);
        
        // Simular click
        a.click();
        
        // Limpiar
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        this.descargandoPDF[idAnimal] = false; // ✅ Usar la constante
        
        this.messageService.add({
          severity: 'success',
          summary: 'Descarga exitosa',
          detail: `Ficha de ${animal.alias} descargada correctamente`
        });
      },
      error: (error) => {
        console.error('Error al descargar ficha:', error);
        this.descargandoPDF[idAnimal] = false; // ✅ Usar la constante
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo descargar la ficha del animal'
        });
      }
    });
  }

  formatearSexo(sexo: string): string {
    return sexo === 'M' ? 'Macho' : 'Hembra';
  }

  formatearFecha(fecha: string | undefined): string {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-EC');
  }
}