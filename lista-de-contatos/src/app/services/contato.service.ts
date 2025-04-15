import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Contato } from '../models/contato.model';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {
  // Alterando a URL para apontar para o servidor Spring Boot
  private apiUrl = 'http://localhost:8080/api/contatos';

  constructor(
    private http: HttpClient
  ) {}

  getContatos(): Observable<Contato[]> {
    return this.http.get<Contato[]>(this.apiUrl)
      .pipe(
        retry(1), // Tenta uma vez mais em caso de falha
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

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'Ocorreu um erro desconhecido!';

    if (error.status === 0) {
      // Erro de conexão ou CORS
      errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando e se o CORS está configurado corretamente.';
    } else if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro retornado pelo backend
      errorMessage = `Código de erro: ${error.status}, Mensagem: ${error.message}`;
      if (error.error && typeof error.error === 'string') {
        errorMessage += ` - Detalhes: ${error.error}`;
      }
    }

    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}