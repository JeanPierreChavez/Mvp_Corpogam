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

export interface QRResponse {
  success: boolean;
  qr_code: string;
  url: string;
  codigo_unico: string;
  codigo_animal: string;
  alias: string;
}

export interface FichaData {
  success: boolean;
  data: {
    id_animal: number;
    codigo_animal: string;
    alias: string;
    sexo: string;
    sexo_texto: string;
    fecha_nacimiento: string;
    fecha_baja?: string;
    fecha_informe: string;
    edad_en_meses: number;
    raza: string;
    color: string;
    estado: string;
    arete_numero?: string;
    chip_rfid?: string;
    lugar_nacimiento: string;
    procedencia: string;
    nombre_finca: string;
    ubicacion: string;
    codigo_madre: string;
    codigo_padre: string;
    nombre_madre?: string;
    nombre_padre?: string;
    etapa_actual: string;
    ultimo_peso: number;
    vacunas: Array<{
      numero: number;
      nombre_vacuna: string;
      fecha_aplicacion: string;
      proxima_dosis: string;
      estado_vacunacion: string;
    }>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private apiUrl = 'http://localhost:3001/api/animal';
  private reporteUrl = 'http://localhost:3001/api/reporte';

  constructor(private http: HttpClient) {}

  // ==================== GESTIÓN DE ANIMALES ====================
  
  obtenerAnimales(): Observable<Animal[]> {
    return this.http.get<Animal[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  obtenerAnimalPorId(id: number): Observable<Animal> {
    return this.http.get<Animal>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // ⭐ AGREGAR: Registrar animal
  registrarAnimal(animal: Animal): Observable<any> {
    return this.http.post<any>(this.apiUrl, animal).pipe(
      catchError(this.handleError)
    );
  }

  // ⭐ AGREGAR: Subir CSV
  subirCSV(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    
    return this.http.post<any>(`${this.apiUrl}/csv`, formData).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== REPORTES Y FICHAS ====================

  obtenerDatosFicha(idAnimal: number): Observable<FichaData> {
    console.log('📞 Llamando a:', `${this.reporteUrl}/ficha-datos/${idAnimal}`);
    return this.http.get<FichaData>(`${this.reporteUrl}/ficha-datos/${idAnimal}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error en obtenerDatosFicha:', error);
        let errorMessage = 'Error al obtener datos de la ficha';
        
        if (error.status === 404) {
          errorMessage = 'Animal no encontrado';
        } else if (error.status === 500) {
          errorMessage = 'Error en el servidor';
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor';
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  obtenerFichaPublica(codigoUnico: string): Observable<FichaData> {
    console.log('📞 Llamando a:', `${this.reporteUrl}/ficha-publica/${codigoUnico}`);
    return this.http.get<FichaData>(`${this.reporteUrl}/ficha-publica/${codigoUnico}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error en obtenerFichaPublica:', error);
        let errorMessage = 'Error al obtener la ficha pública';
        
        if (error.status === 404) {
          errorMessage = 'Ficha no encontrada';
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  descargarFichaPDF(idAnimal: number): Observable<Blob> {
    return this.http.get(`${this.reporteUrl}/ficha-pdf/${idAnimal}`, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== CÓDIGO QR ====================

  obtenerQR(idAnimal: number): Observable<QRResponse> {
    return this.http.get<QRResponse>(`${this.reporteUrl}/ficha-qr/${idAnimal}`).pipe(
      catchError(this.handleError)
    );
  }

  descargarQR(idAnimal: number): Observable<Blob> {
    return this.http.get(`${this.reporteUrl}/ficha-qr-download/${idAnimal}`, {
      responseType: 'blob'
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ==================== MANEJO DE ERRORES ====================

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor';
      } else {
        errorMessage = error.error?.message || `Error ${error.status}`;
      }
    }
    
    console.error('Error en AnimalService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}