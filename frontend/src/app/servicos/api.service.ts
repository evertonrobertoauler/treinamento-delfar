import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  async consultarApi<R = any, P = any>(metodo: 'POST' | 'GET', url: string, dados?: P): Promise<R> {
    if (metodo === 'GET') {
      const req$ = this.http.get(`${this.URL}/${url}`, { withCredentials: true });
      return (await firstValueFrom(req$)) as any;
    } else if (metodo === 'POST') {
      const req$ = this.http.post(`${this.URL}/${url}`, dados, {
        withCredentials: true
      });
      return (await firstValueFrom(req$)) as any;
    } else {
      throw new Error(`Método não implementado: ${metodo}`);
    }
  }
}
