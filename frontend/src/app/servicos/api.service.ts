import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private URL = 'http://localhost:3000';

  logado$ = new BehaviorSubject(false);

  constructor(private http: HttpClient) {}

  async consultarApi<R = any, P = any>(metodo: 'POST' | 'GET', url: string, dados?: P): Promise<R> {
    try {
      if (metodo === 'GET') {
        const req$ = this.http.get(`${this.URL}/${url}`, { withCredentials: true });
        const res = (await firstValueFrom(req$)) as any;

        if (url === 'logado') {
          this.logado$.next(true);
        } else if (url === 'logout') {
          this.logado$.next(false);
        }

        return res;
      } else if (metodo === 'POST') {
        const req$ = this.http.post(`${this.URL}/${url}`, dados, {
          withCredentials: true
        });
        return (await firstValueFrom(req$)) as any;
      } else {
        throw new Error(`Método não implementado: ${metodo}`);
      }
    } catch (erro) {
      if ((erro as HttpErrorResponse)?.status === 401) {
        this.logado$.next(false);
      }

      console.error(erro);
      throw erro;
    }
  }
}
