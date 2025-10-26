import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AnimalService, Animal } from '../services/animal.service';
import { VacunaService, VacunaAplicadaDetalle } from '../services/vacuna.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ToastModule, HttpClientModule, CommonModule],
  providers: [AnimalService, VacunaService, MessageService],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit, OnDestroy, AfterViewInit {
  
  animales: Animal[] = [];
  vacunasUrgentes: VacunaAplicadaDetalle[] = [];
  cargando: boolean = false;
  
  nombreUsuario: string = 'Usuario';
  fechaActual: string = '';
  horaActual: string = '';
  
  private intervalId: any;

  constructor(
    private animalService: AnimalService,
    private vacunaService: VacunaService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.actualizarFechaHora();
    this.intervalId = setInterval(() => this.actualizarFechaHora(), 1000);
    this.cargarAnimales();
    this.cargarVacunasUrgentes();
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
    this.cargando = true;
    
    this.animalService.obtenerAnimales().subscribe({
      next: (data) => {
        this.animales = data;
        this.cargando = false;
        console.log('✅ Animales cargados:', data.length);
      },
      error: (error) => {
        console.error('❌ Error al cargar animales:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los animales'
        });
        this.cargando = false;
      }
    });
  }

  cargarVacunasUrgentes(): void {
    this.vacunaService.obtenerVacunasUrgentes().subscribe({
      next: (data) => {
        // Obtener solo las primeras 5 vacunas urgentes
        this.vacunasUrgentes = data.slice(0, 5);
        console.log('✅ Vacunas urgentes cargadas:', this.vacunasUrgentes.length);
      },
      error: (error) => {
        console.error('❌ Error al cargar vacunas urgentes:', error);
      }
    });
  }

  formatearFecha(fecha: string | undefined): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-EC');
  }

  obtenerClaseEstado(estado: string): string {
    if (estado === 'Urgente') return 'danger';
    if (estado === 'Próximo') return 'warning';
    return 'success';
  }
}