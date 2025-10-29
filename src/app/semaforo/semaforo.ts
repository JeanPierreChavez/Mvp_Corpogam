import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VacunaService, VacunasSemaforo, VacunaSemaforo } from '../services/vacuna.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-semaforo',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [VacunaService],
  templateUrl: './semaforo.html',
  styleUrl: './semaforo.scss'
})
export class Semaforo implements OnInit, OnDestroy, AfterViewInit {
  vacunasATiempo: VacunaSemaforo[] = [];
  vacunasProximas: VacunaSemaforo[] = [];
  vacunasVencidas: VacunaSemaforo[] = [];
  
  // ⭐ Variables para búsqueda
  busquedaATiempo: string = '';
  busquedaProximas: string = '';
  busquedaVencidas: string = '';
  
  cargando: boolean = false;
  error: string = '';

  // Variables para el modal
  mostrarModal: boolean = false;
  vacunaSeleccionada: VacunaSemaforo | null = null;
  nuevaFechaAplicacion: string = '';
  nuevaProximaDosis: string = '';
  guardando: boolean = false;
  mensajeExito: string = '';
  mensajeError: string = '';

  nombreUsuario: string = 'Usuario';
  fechaActual: string = '';
  horaActual: string = '';
  private intervalId: any;

  constructor(
    private vacunaService: VacunaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.actualizarFechaHora();
    this.intervalId = setInterval(() => this.actualizarFechaHora(), 1000);
    this.cargarVacunas();
  }

  ngAfterViewInit(): void {
    this.inicializarEventos();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private inicializarEventos(): void {
    const menuBtn = document.getElementById('menu_btn');
    const closeBtn = document.getElementById('close-btn');
    const sidebar = document.querySelector('aside');
    const themeToggler = document.querySelector('.theme-toggler');

    if (menuBtn && sidebar) {
      menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
      });
    }

    if (closeBtn && sidebar) {
      closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('active');
      });
    }

    if (themeToggler) {
      themeToggler.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme-variables');
        
        const sunIcon = themeToggler.querySelector('span:nth-child(1)');
        const moonIcon = themeToggler.querySelector('span:nth-child(2)');
        
        sunIcon?.classList.toggle('active');
        moonIcon?.classList.toggle('active');
      });
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

  cargarVacunas(): void {
    this.cargando = true;
    this.error = '';

    this.vacunaService.obtenerVacunasSemaforo().subscribe({
      next: (datos: VacunasSemaforo) => {
        this.vacunasATiempo = datos.a_tiempo || [];
        this.vacunasProximas = datos.proximo || [];
        this.vacunasVencidas = datos.vencido || [];
        this.cargando = false;
        console.log('✅ Vacunas cargadas:', datos);
      },
      error: (err) => {
        console.error('❌ Error al cargar vacunas:', err);
        this.error = 'No se pudieron cargar las vacunas';
        this.cargando = false;
      }
    });
  }

  // ⭐ FUNCIONES DE FILTRADO
  get vacunasATiempoFiltradas(): VacunaSemaforo[] {
    return this.filtrarVacunas(this.vacunasATiempo, this.busquedaATiempo);
  }

  get vacunasProximasFiltradas(): VacunaSemaforo[] {
    return this.filtrarVacunas(this.vacunasProximas, this.busquedaProximas);
  }

  get vacunasVencidasFiltradas(): VacunaSemaforo[] {
    return this.filtrarVacunas(this.vacunasVencidas, this.busquedaVencidas);
  }

  private filtrarVacunas(vacunas: VacunaSemaforo[], busqueda: string): VacunaSemaforo[] {
    if (!busqueda.trim()) {
      return vacunas;
    }

    const termino = busqueda.toLowerCase().trim();
    
    return vacunas.filter(vacuna => 
      vacuna.codigo_animal.toLowerCase().includes(termino) ||
      vacuna.alias.toLowerCase().includes(termino) ||
      vacuna.nombre_vacuna.toLowerCase().includes(termino)
    );
  }

  limpiarBusqueda(tabla: 'aTiempo' | 'proximas' | 'vencidas'): void {
    switch(tabla) {
      case 'aTiempo':
        this.busquedaATiempo = '';
        break;
      case 'proximas':
        this.busquedaProximas = '';
        break;
      case 'vencidas':
        this.busquedaVencidas = '';
        break;
    }
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'Sin fecha';
    return new Date(fecha).toLocaleDateString('es-EC');
  }

  obtenerEstadoTexto(vacuna: VacunaSemaforo): string {
    if (!vacuna.fecha_aplicacion) {
      return 'Sin Vacunar';
    }
    return 'Vacunada';
  }

  // FUNCIONES DEL MODAL
  abrirModal(vacuna: VacunaSemaforo): void {
    this.vacunaSeleccionada = vacuna;
    this.mostrarModal = true;
    
    if (vacuna.fecha_aplicacion) {
      this.nuevaFechaAplicacion = this.convertirFechaParaInput(vacuna.fecha_aplicacion);
    }
    if (vacuna.proxima_dosis) {
      this.nuevaProximaDosis = this.convertirFechaParaInput(vacuna.proxima_dosis);
    }
    
    this.mensajeExito = '';
    this.mensajeError = '';
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.vacunaSeleccionada = null;
    this.nuevaFechaAplicacion = '';
    this.nuevaProximaDosis = '';
    this.mensajeExito = '';
    this.mensajeError = '';
  }

  convertirFechaParaInput(fecha: string): string {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  actualizarVacuna(): void {
    if (!this.vacunaSeleccionada) return;

    this.guardando = true;
    this.mensajeError = '';
    this.mensajeExito = '';

    const datosActualizados = {
      fecha_aplicacion: this.nuevaFechaAplicacion,
      proxima_dosis: this.nuevaProximaDosis
    };

    const idVacunaAnimal = this.vacunaSeleccionada.id_vacuna_animal;

    this.vacunaService.actualizarVacunaCompleta(idVacunaAnimal, datosActualizados).subscribe({
      next: (response) => {
        this.mensajeExito = '✅ Vacuna actualizada correctamente';
        this.guardando = false;
        
        setTimeout(() => {
          this.cargarVacunas();
          this.cerrarModal();
        }, 1500);
      },
      error: (err) => {
        console.error('Error al actualizar vacuna:', err);
        this.mensajeError = '❌ Error al actualizar la vacuna. Intenta nuevamente.';
        this.guardando = false;
      }
    });
  }

  // Funciones de navegación
  irRegistro() {
    this.router.navigate(['/registro']);
  }

  irAnimales() {
    this.router.navigate(['/animales']);
  }

  irVacunas() {
    this.router.navigate(['/vacunas']);
  }

  riInicio() {
    this.router.navigate(['/dashboard']);
  }

  irSemaforo() {
    this.router.navigate(['/semaforo']);
  }
}