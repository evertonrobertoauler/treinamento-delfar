import { ApplicationRef, Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { combineLatest, defer, from, merge, Observable } from 'rxjs';
import { ObservedValueOf, timer } from 'rxjs';
import { debounceTime, delayWhen, distinctUntilChanged, skip } from 'rxjs/operators';
import { map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { keys, values, zipObject, has, set, get, cloneDeep } from 'lodash-es';
import * as VMasker from 'vanilla-masker';
import { diff } from 'deep-object-diff';

import { TIPO_VALOR, PRECISAO_VALOR, Opcao } from '@app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UteisService {
  constructor(private appRef: ApplicationRef) {}

  isNull(v: any) {
    return ['', null, undefined].includes(v);
  }

  isOp(v: any) {
    return has(v, 'label') && has(v, 'valor');
  }

  converterOptionValor(v: Opcao | Opcao[]) {
    if (Array.isArray(v)) {
      if (v.length) {
        return v.map(o => (this.isOp(o) ? o.valor : o));
      } else if (!v.length) {
        return null;
      }
    } else if (this.isOp(v)) {
      return v.valor;
    } else if (this.isNull(v)) {
      return null;
    }

    return v;
  }

  converterOptionsParaValor(obj: any, campos: (string | string[])[]) {
    return campos.reduce(
      (newObj, campo) => set(newObj, campo, this.converterOptionValor(get(newObj, campo))),
      cloneDeep(obj)
    );
  }

  diffObjetos(obj1: any, obj2: any) {
    return Object.keys(diff(obj1 || {}, obj2 || {})).length > 0;
  }

  mudanca<T = any>(control: AbstractControl, emitirPrimeiro = false, retornarValor = false) {
    if (!control) {
      console.warn('AbstractControl inválido!');
      return from([null as T]);
    }

    const str = (v: any) => JSON.stringify(v);
    const op = (v: any) => this.converterOptionValor(v);
    const fnOpStr = (v: any) =>
      (op(Array.isArray(v) ? v : [v]) || []).map((o: any) => str(o)).sort();
    const fn = (v: any) => fnOpStr(v).join('-');

    const mudanca$ = merge(
      defer(async () => control.value),
      control.valueChanges
    )
      .pipe(debounceTime(50))
      .pipe(map(() => control.value))
      .pipe(distinctUntilChanged((a, b) => fn(a) === fn(b)));

    const r1$ = emitirPrimeiro ? mudanca$ : mudanca$.pipe(skip(1));
    const r2$ = retornarValor ? r1$.pipe(map(v => this.converterOptionValor(v))) : r1$;
    return r2$.pipe<T>(shareReplay({ bufferSize: 1, refCount: true }));
  }

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
