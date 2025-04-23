import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Contato } from '../models/contato.model';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {
  // Alterando a URL para apontar para o servidor Spring Boot
  private apiUrl = 'http://localhost:8080/api/contatos';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // Use uma arrow function para preservar o contexto 'this'
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Ocorreu um erro desconhecido';
    
    // Verificação segura para ambiente de servidor vs navegador
    if (this.isBrowser) {
      // Código específico para navegador
      if (error.error instanceof ErrorEvent) {
        // Erro do cliente
        errorMessage = `Erro: ${error.error.message}`;
      } else {
        // Erro da API
        errorMessage = `Código: ${error.status}, Mensagem: ${error.message}`;
      }
    } else {
      // Código seguro para servidor
      errorMessage = `Erro HTTP: ${error.status}, ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }

  getContatos(): Observable<Contato[]> {
    return this.http.get<Contato[]>(this.apiUrl)
      .pipe(
        map(response => {
          // Garantir que a resposta é um array
          if (!Array.isArray(response)) {
            console.error('API não retornou um array:', response);
            return [];
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getContato(id: number): Observable<Contato> {
    return this.http.get<Contato>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createContato(contato: Omit<Contato, 'id'>): Observable<Contato> {
    return this.http.post<Contato>(this.apiUrl, contato, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(catchError(this.handleError));
  }

  updateContato(id: number, contato: Contato): Observable<Contato> {
    return this.http.put<Contato>(`${this.apiUrl}/${id}`, contato, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(catchError(this.handleError));
  }

  deleteContato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  buscarPorTermo(termo: string): Observable<Contato[]> {
    let params = new HttpParams();
    if (termo) {
      params = params.set('termo', termo);
    }

    return this.http.get<Contato[]>(`${this.apiUrl}/buscar`, { params })
      .pipe(catchError(this.handleError));
  }
}