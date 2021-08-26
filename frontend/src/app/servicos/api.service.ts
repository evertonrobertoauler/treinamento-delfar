import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  async consultarApi<R = any, P = any>(
    metodo: 'POST' | 'GET',
    url: string,
    dados?: P
  ) {
    if (metodo === 'GET') {
      return await firstValueFrom(this.http.get(`${this.URL}/${url}`));
    } else if (metodo === 'POST') {
      return await firstValueFrom(this.http.post(`${this.URL}/${url}`, dados));
    } else {
      throw new Error(`Método não implementado: ${metodo}`);
    }
  }
}
