import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VacunaService, VacunasSemaforo, VacunaSemaforo } from '../services/vacuna.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-semaforo',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [VacunaService],
  templateUrl: './semaforo.html',
  styleUrl: './semaforo.scss'
})
export class Semaforo implements OnInit, OnDestroy, AfterViewInit {
  vacunasATiempo: VacunaSemaforo[] = [];
  vacunasProximas: VacunaSemaforo[] = [];
  vacunasVencidas: VacunaSemaforo[] = [];
  
  cargando: boolean = false;
  error: string = '';

  nombreUsuario: string = 'Usuario';
  fechaActual: string = '';
  horaActual: string = '';
  private intervalId: any;

  constructor( private vacunaService: VacunaService,
    private router: Router

  )
 {}

  ngOnInit(): void {
    this.actualizarFechaHora();
    this.intervalId = setInterval(() => this.actualizarFechaHora(), 1000);
    this.cargarVacunas();
  }

  ngAfterViewInit(): void {
    // Inicializar event listeners después de que la vista se cargue
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

    // Toggle menú lateral
    if (menuBtn && sidebar) {
      menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
      });
    }

    // Cerrar menú lateral
    if (closeBtn && sidebar) {
      closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('active');
      });
    }

    // Theme toggler (modo oscuro)
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