import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AnimalService, FichaData } from '../services/animal.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-ficha-animales',
  standalone: true,
  imports: [
    CommonModule, 
    ButtonModule, 
    CardModule, 
    TableModule, 
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './ficha-animales.html',
  styleUrl: './ficha-animales.scss'
})
export class FichaAnimales implements OnInit {
  datos: any = null;
  cargando: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private animalService: AnimalService
  ) {
    console.log('🔧 FichaAnimales Constructor llamado');
  }

  ngOnInit(): void {
    console.log('🚀 ngOnInit ejecutado');
    
    // Obtener parámetros de la ruta
    const idAnimal = this.route.snapshot.paramMap.get('id_animal');
    const codigoUnico = this.route.snapshot.paramMap.get('codigo_unico');

    console.log('📍 Parámetros de ruta:', { idAnimal, codigoUnico });

    if (codigoUnico) {
      console.log('🔑 Cargando por código único:', codigoUnico);
      this.cargarFichaPorCodigo(codigoUnico);
    } else if (idAnimal) {
      console.log('🆔 Cargando por ID:', idAnimal);
      this.cargarFichaPorId(parseInt(idAnimal));
    } else {
      console.error('❌ No hay parámetros válidos');
      this.error = 'Parámetros inválidos';
      this.cargando = false;
    }
  }

  cargarFichaPorId(idAnimal: number): void {
    console.log('📡 Iniciando carga por ID:', idAnimal);
    this.cargando = true;
    
    this.animalService.obtenerDatosFicha(idAnimal).subscribe({
      next: (response: FichaData) => {
        console.log('✅ Respuesta recibida:', response);
        
        if (response.success) {
          this.datos = response.data;
          console.log('✅ Datos asignados:', this.datos);
        } else {
          this.error = 'Animal no encontrado';
          console.error('❌ Success = false');
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error en la petición:', err);
        this.error = err.message || 'Error al cargar la ficha del animal';
        this.cargando = false;
      }
    });
  }

  cargarFichaPorCodigo(codigoUnico: string): void {
    console.log('📡 Iniciando carga por código:', codigoUnico);
    this.cargando = true;
    
    this.animalService.obtenerFichaPublica(codigoUnico).subscribe({
      next: (response: FichaData) => {
        console.log('✅ Respuesta recibida:', response);
        
        if (response.success) {
          this.datos = response.data;
          console.log('✅ Datos asignados:', this.datos);
        } else {
          this.error = 'Animal no encontrado';
          console.error('❌ Success = false');
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error en la petición:', err);
        this.error = err.message || 'Error al cargar la ficha del animal';
        this.cargando = false;
      }
    });
  }

  descargarPDF(): void {
    if (!this.datos) return;
    
    console.log('📥 Descargando PDF para ID:', this.datos.id_animal);
    
    this.animalService.descargarFichaPDF(this.datos.id_animal).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ficha_${this.datos.codigo_animal}_${this.datos.alias}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        console.log('✅ PDF descargado');
      },
      error: (err) => {
        console.error('❌ Error al descargar PDF:', err);
        alert('No se pudo descargar el PDF');
      }
    });
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-EC');
  }

  imprimirFicha(): void {
    window.print();
  }
}