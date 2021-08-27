import { Component, ViewChild, forwardRef, Input, ElementRef } from '@angular/core';
import { ContentChild, TemplateRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';

import { TIPO_VALOR } from '@app/interfaces';
import { UteisService } from '@app/servicos';

@Component({
  selector: 'app-campo-numerico',
  templateUrl: './campo-numerico.component.html',
  styleUrls: ['./campo-numerico.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CampoNumericoComponent),
      multi: true
    }
  ]
})
export class CampoNumericoComponent implements ControlValueAccessor {
  @Input() tipo: TIPO_VALOR;
  @Input() placeholder = '';

  @ViewChild('input', { static: true }) input: ElementRef<HTMLInputElement>;

  atualizar$ = new BehaviorSubject<any>(null);

  mudanca$ = this.atualizar$.pipe(debounceTime(100)).pipe(tap(() => this.onChange()));

  public valor: number;
  public desabilitado = false;
  private propagarMudanca: (valor: number) => void = _ => null;
  private componenteTocado: () => void = () => null;

  constructor(private uteis: UteisService) {}

  writeValue(valor: number | string) {
    this.valor = this.uteis.formatarValorSys(valor);
    this.setarValor();
  }

  registerOnChange(fn: (valor: number) => void) {
    this.propagarMudanca = fn;
  }

  registerOnTouched(fn: () => void) {
    this.componenteTocado = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.desabilitado = isDisabled;
  }

  setarValor() {
    const input = this.input.nativeElement;

    if (input instanceof HTMLInputElement) {
      input.value = this.uteis.formatarValor(this.valor, this.tipo);
    }
  }

  limparCampo() {
    this.input.nativeElement.value = '';
    this.onChange();
  }

  private onChange() {
    const old = this.valor;

    const input = this.input.nativeElement;
    const valor = this.uteis.formatarValor(input.value, this.tipo);
    this.valor = this.uteis.formatarValorSys(valor);

    if (old !== this.valor) {
      this.componenteTocado();
      this.propagarMudanca(this.valor);
    }

    if (valor !== input.value) {
      input.value = valor;
    }
  }
}
