import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AnimalService, Animal, QRResponse } from '../services/animal.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';  // ⭐ AGREGAR
import { TooltipModule } from 'primeng/tooltip'; // ⭐ AGREGAR

interface QRData {
  id_animal: number;
  codigo_animal: string;
  alias: string;
  qr_code: string;
  url: string;
  codigo_unico: string;
}

@Component({
  selector: 'app-animales',
  standalone: true,
  imports: [
    CommonModule, 
    ToastModule, 
    HttpClientModule, 
    ButtonModule,
    DialogModule,    // ⭐ AGREGAR
    TooltipModule    // ⭐ AGREGAR
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
  
  // ⭐ Variables para modal QR
  mostrarModalQR: boolean = false;
  qrActual: QRData | null = null;
  cargandoQR: boolean = false;
  
  nombreUsuario: string = 'Usuario';
  fechaActual: string = '';
  horaActual: string = '';

  private intervalId: any;

  constructor(
    private animalService: AnimalService,
    private messageService: MessageService,
    private router: Router  // ⭐ AGREGAR si usas navegación
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

  // ⭐ NUEVA: Ver ficha web
// ⭐ CORREGIDA: Ver ficha web
verFichaWeb(animal: Animal): void {
  if (!animal.id_animal) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: 'No se puede ver la ficha de este animal'
    });
    return;
  }

  // ⭐ IMPORTANTE: Debe coincidir con la ruta en app.routes.ts
  window.open(`/ficha-animal/${animal.id_animal}`, '_blank');
  
  // O si prefieres navegar en la misma pestaña:
  // this.router.navigate(['/ficha-animal', animal.id_animal]);
}

  // ✅ EXISTENTE: Descargar PDF
  descargarFicha(animal: Animal): void {
    if (!animal.id_animal) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No se puede descargar la ficha de este animal'
      });
      return;
    }
    const idAnimal = animal.id_animal;
    this.descargandoPDF[idAnimal] = true;

    this.animalService.descargarFichaPDF(idAnimal).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ficha_${animal.codigo_animal}_${animal.alias}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        this.descargandoPDF[idAnimal] = false;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Descarga exitosa',
          detail: `Ficha de ${animal.alias} descargada correctamente`
        });
      },
      error: (error) => {
        console.error('Error al descargar ficha:', error);
        this.descargandoPDF[idAnimal] = false;
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo descargar la ficha del animal'
        });
      }
    });
  }

  // ⭐ NUEVA: Mostrar modal QR
mostrarQR(animal: Animal): void {
  if (!animal.id_animal) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: 'No se puede generar el QR de este animal'
    });
    return;
  }

  this.cargandoQR = true;
  this.mostrarModalQR = true;
  const idAnimal = animal.id_animal;

  this.animalService.obtenerQR(idAnimal).subscribe({
    next: (response: QRResponse) => {
      if (response.success) {
        this.qrActual = {
          id_animal: idAnimal,
          codigo_animal: animal.codigo_animal,
          alias: animal.alias,
          qr_code: response.qr_code,
          url: response.url, // ⭐ Esta URL debe ser: http://localhost:4200/ficha-publica/[codigo_unico]
          codigo_unico: response.codigo_unico
        };
        this.cargandoQR = false;
      }
    },
    error: (error) => {
      console.error('Error al generar QR:', error);
      this.cargandoQR = false;
      this.mostrarModalQR = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo generar el código QR'
      });
    }
  });
}

  // ⭐ NUEVA: Descargar QR
  descargarQRImagen(): void {
    if (!this.qrActual) return;

    this.animalService.descargarQR(this.qrActual.id_animal).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `QR_${this.qrActual!.codigo_animal}_${this.qrActual!.alias}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Descarga exitosa',
          detail: 'Código QR descargado correctamente'
        });
      },
      error: (error) => {
        console.error('Error al descargar QR:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo descargar el código QR'
        });
      }
    });
  }

  // ⭐ NUEVA: Copiar URL
  copiarURL(): void {
    if (!this.qrActual) return;

    navigator.clipboard.writeText(this.qrActual.url).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Copiado',
        detail: 'URL copiada al portapapeles'
      });
    }).catch(err => {
      console.error('Error al copiar:', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo copiar la URL'
      });
    });
  }

  // ⭐ NUEVA: Cerrar modal
  cerrarModalQR(): void {
    this.mostrarModalQR = false;
    this.qrActual = null;
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