import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Animal {
  id_animal?: number;
  codigo_animal: string;
  arete_numero?: string;
  chip_rfid?: string;
  alias: string;
  sexo: string;
  fecha_nacimiento: string;
  raza?: string;
  color?: string;
  peso_inicial: number;
  estado?: string;
  fecha_baja?: string;
  motivo_baja?: string;
  id_madre?: number;
  id_padre?: number;
  lugar_nacimiento?: string;
  procedencia?: string;
  id_finca?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private apiUrl = 'http://localhost:3001/api/animal';
  private pdfUrl = 'http://localhost:3001/api/pdf';

  constructor(private http: HttpClient) {}

  obtenerAnimales(): Observable<Animal[]> {
    return this.http.get<Animal[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  registrarAnimal(animal: Animal): Observable<any> {
    return this.http.post<any>(this.apiUrl, animal).pipe(
      catchError(this.handleError)
    );
  }

  obtenerAnimalPorId(id: number): Observable<Animal> {
    return this.http.get<Animal>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ✅ Método corregido sin observe: 'response'
  descargarFichaPDF(idAnimal: number): Observable<Blob> {
    return this.http.get(`${this.pdfUrl}/ficha-animal/${idAnimal}`, {
      responseType: 'blob'
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Error al descargar el PDF';
        
        if (error.status === 404) {
          errorMessage = 'Animal no encontrado';
        } else if (error.status === 500) {
          errorMessage = 'Error en el servidor al generar el PDF';
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor';
        }
        
        console.error('Error al descargar PDF:', error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  subirCSV(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    
    return this.http.post<any>(`${this.apiUrl}/csv`, formData).pipe(
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
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}