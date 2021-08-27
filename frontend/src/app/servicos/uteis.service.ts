import { ApplicationRef, Injectable } from '@angular/core';
import { combineLatest, from, merge, Observable } from 'rxjs';
import { ObservedValueOf, timer } from 'rxjs';
import { debounceTime, delayWhen } from 'rxjs/operators';
import { map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { keys, values, zipObject } from 'lodash-es';
import * as VMasker from 'vanilla-masker';

import { TIPO_VALOR, PRECISAO_VALOR } from '@app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UteisService {
  constructor(private appRef: ApplicationRef) {}

  combineLatestObj<T>(obj: T, debounce = 200) {
    type Retorno = Observable<{ [P in keyof T]?: ObservedValueOf<T[P]> }>;

    const labels = keys(obj) as (keyof T)[];

    let delay = 0;

    const fnMostrarErro = (e: Error, i: number) => {
      console.error(labels[i], e, labels);
      delay = delay ? delay * 2 : 5000;
    };

    const fnError = (erros: Observable<any>, i: number) =>
      erros.pipe(tap(e => fnMostrarErro(e, i))).pipe(delayWhen(() => timer(delay)));

    const observables = values(obj)
      .map(o => merge(from([null]), o as Observable<any>))
      .map((o, i) => o.pipe(retryWhen(e => fnError(e, i))));

    const obj$ = combineLatest(observables)
      .pipe(debounceTime(debounce))
      .pipe(map(l => zipObject(labels, l)))
      .pipe(shareReplay({ bufferSize: 1, refCount: true })) as Observable<any>;

    return merge(from([{}]), obj$)
      .pipe(debounceTime(10))
      .pipe(tap(() => this.appRef.tick())) as Retorno;
  }

  formatarValor(
    valor: number | string,
    tipo: TIPO_VALOR,
    extra?: { prefixo?: string; sufixo?: string }
  ) {
    const precisao = PRECISAO_VALOR[tipo];

    const str =
      typeof valor === 'number' ? valor.toFixed(precisao || 0) : valor ? valor + '' : null;

    const negativo = str && str[0] === '-' ? '-' : '';
    const config = { unit: '', precision: precisao || 0 };
    const retorno = str ? negativo + VMasker.toMoney(str.replace(/^0+/, ''), config) : '';
    const vRetorno = precisao !== null ? retorno : retorno.replace(/\.+/gi, '');

    return vRetorno && extra ? (extra.prefixo || '') + vRetorno + (extra.sufixo || '') : vRetorno;
  }

  formatarValorSys(valor: number | string) {
    if (typeof valor === 'number') {
      return valor;
    } else {
      return valor ? parseFloat((valor + '').replace(/\./gi, '').replace(',', '.')) : null;
    }
  }
}
