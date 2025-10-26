import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { FileUploadModule, FileUploadEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { fadeIn } from './animations';
import { AnimalService, Animal } from '../services/animal.service';
import { VacunaService, AplicacionVacuna, VacunaCatalogo } from '../services/vacuna.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    FileUploadModule,
    ToastModule,
    CommonModule,
    FormsModule,
    RadioButtonModule,
    HttpClientModule,
    InputTextModule,
    ButtonModule
  ],
  providers: [MessageService, AnimalService, VacunaService],
  templateUrl: './registro.html',
  styleUrls: ['./registro.scss'],
  animations: [fadeIn]
})
export class Registro implements OnInit, OnDestroy {
  @ViewChild('formAnimal') formAnimal!: NgForm;
  @ViewChild('formVacuna') formVacuna!: NgForm;
  
  modoSeleccionado: string = 'formulario';
  uploadedFiles: any[] = [];
  
  // Lista de animales y vacunas
  animales: Animal[] = [];
  catalogoVacunas: VacunaCatalogo[] = [];
  
  formData = {
    codigo: '',
    numeroArete: '',
    chipRfid: '',
    alias: '',
    sexo: '',
    fechaNacimiento: '',
    raza: '',
    color: '',
    pesoInicial: 0,
    estado: 'VIVO',
    fechaBaja: '',
    motivoBaja: '',
    padre: '',
    madre: '',
    lugarNacimiento: '',
    procedencia: '',
    ubicacion: ''
  };
  
  formVacunaData = {
    idAnimal: 0,
    idVacuna: 0,
    fechaAplicacion: '',
    proximaDosis: ''
  };
  
  nombreUsuario: string = 'Usuario';
  fechaActual: string = '';
  horaActual: string = '';
  private intervalId: any;
  
  isSubmitting: boolean = false;
  isUploading: boolean = false;

  constructor(
    private messageService: MessageService,
    private animalService: AnimalService,
    private vacunaService: VacunaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.actualizarFechaHora();
    this.intervalId = setInterval(() => this.actualizarFechaHora(), 1000);
    this.cargarAnimales();
    this.cargarCatalogoVacunas();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  actualizarFechaHora(): void {
    const ahora = new Date();
    
    this.fechaActual = ahora.toLocaleDateString('es-EC', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Guayaquil'
    });
    
    this.horaActual = ahora.toLocaleTimeString('es-EC', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'America/Guayaquil'
    });
  }

  cargarAnimales(): void {
    this.animalService.obtenerAnimales().subscribe({
      next: (animales) => {
        this.animales = animales;
        console.log('✅ Animales cargados:', animales.length);
      },
      error: (error) => {
        console.error('❌ Error al cargar animales:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los animales'
        });
      }
    });
  }

  cargarCatalogoVacunas(): void {
    this.vacunaService.obtenerCatalogoVacunas().subscribe({
      next: (vacunas) => {
        this.catalogoVacunas = vacunas;
        console.log('✅ Catálogo de vacunas cargado:', vacunas.length);
      },
      error: (error) => {
        console.error('❌ Error al cargar vacunas:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el catálogo de vacunas'
        });
      }
    });
  }

  registrarAnimal(): void {
    console.log('🔵 Iniciando registro de animal...');
    console.log('📋 Datos del formulario:', this.formData);
    
    // Validación manual de campos requeridos
    if (!this.formData.codigo?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'El código del animal es obligatorio'
      });
      return;
    }

    if (!this.formData.alias?.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'El alias/nombre es obligatorio'
      });
      return;
    }

    if (!this.formData.sexo) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'El sexo es obligatorio'
      });
      return;
    }

    if (!this.formData.fechaNacimiento) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'La fecha de nacimiento es obligatoria'
      });
      return;
    }

    if (!this.formData.pesoInicial || this.formData.pesoInicial <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'El peso inicial debe ser mayor a 0'
      });
      return;
    }

    this.isSubmitting = true;

    // 🔧 Mapear correctamente el sexo
    let sexoMapeado: string;
    if (this.formData.sexo === 'Macho') {
      sexoMapeado = 'M';
    } else if (this.formData.sexo === 'Hembra') {
      sexoMapeado = 'H';
    } else {
      sexoMapeado = this.formData.sexo; // Por si ya viene como 'M' o 'H'
    }

    // Preparar datos para el backend
    const animalData: Animal = {
      codigo_animal: this.formData.codigo.trim(),
      alias: this.formData.alias.trim(),
      sexo: sexoMapeado,
      fecha_nacimiento: this.formData.fechaNacimiento,
      peso_inicial: Number(this.formData.pesoInicial),
      estado: this.formData.estado || 'VIVO',
      // Campos opcionales - solo enviar si tienen valor
      ...(this.formData.numeroArete?.trim() && { arete_numero: this.formData.numeroArete.trim() }),
      ...(this.formData.chipRfid?.trim() && { chip_rfid: this.formData.chipRfid.trim() }),
      ...(this.formData.raza?.trim() && { raza: this.formData.raza.trim() }),
      ...(this.formData.color?.trim() && { color: this.formData.color.trim() }),
      ...(this.formData.fechaBaja && { fecha_baja: this.formData.fechaBaja }),
      ...(this.formData.motivoBaja?.trim() && { motivo_baja: this.formData.motivoBaja.trim() }),
      ...(this.formData.lugarNacimiento?.trim() && { lugar_nacimiento: this.formData.lugarNacimiento.trim() }),
      ...(this.formData.procedencia?.trim() && { procedencia: this.formData.procedencia.trim() })
    };

    console.log('📤 Datos a enviar al backend:', animalData);

    this.animalService.registrarAnimal(animalData).subscribe({
      next: (response) => {
        console.log('✅ Animal registrado exitosamente:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Animal "${this.formData.alias}" registrado correctamente`
        });
        
        this.limpiarFormularioAnimal();
        this.cargarAnimales(); // Recargar lista
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('❌ Error al registrar animal:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'No se pudo registrar el animal'
        });
        this.isSubmitting = false;
      }
    });
  }

  registrarVacuna(): void {
    console.log('🔵 Iniciando registro de vacuna...');
    console.log('📋 Datos de vacuna:', this.formVacunaData);
    
    if (!this.formVacunaData.idAnimal || this.formVacunaData.idAnimal === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'Debes seleccionar un animal'
      });
      return;
    }

    if (!this.formVacunaData.idVacuna || this.formVacunaData.idVacuna === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'Debes seleccionar una vacuna'
      });
      return;
    }

    if (!this.formVacunaData.fechaAplicacion) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campo requerido',
        detail: 'La fecha de aplicación es obligatoria'
      });
      return;
    }

    this.isSubmitting = true;

    const vacunaData: AplicacionVacuna = {
      id_animal: Number(this.formVacunaData.idAnimal),
      id_vacuna: Number(this.formVacunaData.idVacuna),
      fecha_aplicacion: this.formVacunaData.fechaAplicacion,
      ...(this.formVacunaData.proximaDosis && { proxima_dosis: this.formVacunaData.proximaDosis })
    };

    console.log('📤 Datos de vacuna a enviar:', vacunaData);

    this.vacunaService.aplicarVacuna(vacunaData).subscribe({
      next: (response) => {
        console.log('✅ Vacuna registrada exitosamente:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Vacuna registrada',
          detail: 'Vacuna aplicada correctamente'
        });
        
        this.limpiarFormularioVacuna();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('❌ Error al registrar vacuna:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'No se pudo registrar la vacuna'
        });
        this.isSubmitting = false;
      }
    });
  }

  onUpload(event: FileUploadEvent): void {
    const file = event.files[0];
    
    if (!file) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No se seleccionó ningún archivo'
      });
      return;
    }

    this.isUploading = true;

    this.animalService.subirCSV(file).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `${response.registrados || 0} animales registrados correctamente`
        });
        this.cargarAnimales();
        this.isUploading = false;
      },
      error: (error) => {
        console.error('❌ Error al subir CSV:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'No se pudo procesar el archivo CSV'
        });
        this.isUploading = false;
      }
    });
  }

  limpiarFormularioAnimal(): void {
    this.formData = {
      codigo: '',
      numeroArete: '',
      chipRfid: '',
      alias: '',
      sexo: '',
      fechaNacimiento: '',
      raza: '',
      color: '',
      pesoInicial: 0,
      estado: 'VIVO',
      fechaBaja: '',
      motivoBaja: '',
      padre: '',
      madre: '',
      lugarNacimiento: '',
      procedencia: '',
      ubicacion: ''
    };
    
    // Resetear el formulario de Angular
    if (this.formAnimal) {
      this.formAnimal.resetForm();
    }
  }

  limpiarFormularioVacuna(): void {
    this.formVacunaData = {
      idAnimal: 0,
      idVacuna: 0,
      fechaAplicacion: '',
      proximaDosis: ''
    };
    
    if (this.formVacuna) {
      this.formVacuna.resetForm();
    }
  }

  cambiarModo(modo: string): void {
    this.modoSeleccionado = modo;
  }
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
}