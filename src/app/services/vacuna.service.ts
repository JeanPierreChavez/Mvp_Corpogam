import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface VacunaCatalogo {
  id_vacuna?: number;
  nombre: string;
  descripcion?: string;
}

export interface AplicacionVacuna {
  id_animal: number;
  id_vacuna: number;
  fecha_aplicacion: string;
  proxima_dosis?: string;
}

export interface VacunaAplicadaDetalle {
  id_vacuna_animal: number;
  fecha_aplicacion: string;
  proxima_dosis: string;
  codigo_animal: string;
  alias: string;
  nombre_vacuna: string;
  estado_vacunacion: string;
}

export interface VacunaSemaforo {
  id_vacuna_animal: number;
  fecha_aplicacion: string;
  proxima_dosis: string;
  codigo_animal: string;
  alias: string;
  nombre_vacuna: string;
  estado: 'A_TIEMPO' | 'PROXIMO' | 'VENCIDO';
}

export interface VacunasSemaforo {
  a_tiempo: VacunaSemaforo[];
  proximo: VacunaSemaforo[];
  vencido: VacunaSemaforo[];
}

@Injectable({
  providedIn: 'root'
})
export class VacunaService {
  private apiUrl = 'http://localhost:3001/api/vacuna';

  constructor(private http: HttpClient) {}

  // Catálogo de vacunas
  obtenerCatalogoVacunas(): Observable<VacunaCatalogo[]> {
    return this.http.get<VacunaCatalogo[]>(`${this.apiUrl}/catalogo`).pipe(
      catchError(this.handleError)
    );
  }

  registrarVacunaCatalogo(vacuna: VacunaCatalogo): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/catalogo`, vacuna).pipe(
      catchError(this.handleError)
    );
  }

  // Aplicación de vacunas
  aplicarVacuna(aplicacion: AplicacionVacuna): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/aplicar`, aplicacion).pipe(
      catchError(this.handleError)
    );
  }

  obtenerVacunasAplicadas(): Observable<VacunaAplicadaDetalle[]> {
    return this.http.get<VacunaAplicadaDetalle[]>(`${this.apiUrl}/aplicadas`).pipe(
      catchError(this.handleError)
    );
  }

  obtenerVacunasPorAnimal(idAnimal: number): Observable<VacunaAplicadaDetalle[]> {
    return this.http.get<VacunaAplicadaDetalle[]>(`${this.apiUrl}/aplicadas/animal/${idAnimal}`).pipe(
      catchError(this.handleError)
    );
  }

  obtenerVacunasUrgentes(): Observable<VacunaAplicadaDetalle[]> {
    return this.http.get<VacunaAplicadaDetalle[]>(`${this.apiUrl}/aplicadas/urgentes`).pipe(
      catchError(this.handleError)
    );
  }

  // Semáforo de vacunas
  obtenerVacunasSemaforo(): Observable<VacunasSemaforo> {
    return this.http.get<VacunasSemaforo>(`${this.apiUrl}/aplicadas/semaforo`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor';
      } else {
        errorMessage = error.error?.message || `Error ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Error en VacunaService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  actualizarVacunaCompleta(idVacunaAnimal: number, datos: {fecha_aplicacion: string, proxima_dosis: string}): Observable<any> {
    return this.http.put(`${this.apiUrl}/aplicadas/${idVacunaAnimal}/completo`, datos);
  }
}