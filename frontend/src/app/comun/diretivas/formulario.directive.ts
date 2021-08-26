import { Directive, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Output, EventEmitter, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subscription, fromEvent, Subject, timer } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

interface Erro {
  msg: string;
  campo: HTMLElement;
  index: number;
}

@Directive({
  selector: '[appFormulario]',
})
export class FormularioDirective implements OnInit, OnDestroy {
  static formAtual?: FormularioDirective;

  // Utilizado também no campo-formulario.directive.ts
  public onSubmit$: Observable<any>;
  public ordenarCampos$ = new Subject();

  private submitSubscription: Subscription;
  private ordenarSubscription: Subscription;
  private erros: { [path: string]: Erro } = {};

  private campos: HTMLElement[] = [];

  @Input() formGroup: FormGroup;

  @Output() formSubmit = new EventEmitter();

  constructor(private element: ElementRef) {}

  ngOnInit() {
    FormularioDirective.formAtual = this;

    let bloquearSubmit = false;

    this.onSubmit$ = timer(300).pipe(
      switchMap(() => fromEvent(this.element.nativeElement, 'submit'))
    );

    this.submitSubscription = this.onSubmit$
      .pipe(debounceTime(500))
      .subscribe(() => {
        if (this.formGroup.invalid) {
          console.warn('formSubmit invalid', this.formGroup.value);
          this.mostrarErro().catch(() => null);
        } else if (!bloquearSubmit) {
          this.formSubmit.emit();
          bloquearSubmit = true;
          setTimeout(() => (bloquearSubmit = false), 3000);
        }
      });

    this.ordenarSubscription = this.ordenarCampos$
      .pipe(debounceTime(300))
      .subscribe(() => this.ordenarCampos());
  }

  ngOnDestroy() {
    FormularioDirective.formAtual = null;

    if (this.submitSubscription instanceof Subscription) {
      this.submitSubscription.unsubscribe();
    }

    if (this.ordenarSubscription instanceof Subscription) {
      this.ordenarSubscription.unsubscribe();
    }
  }

  triggerSubmit() {
    const event = new Event('submit', { bubbles: true, cancelable: true });
    this.element.nativeElement.dispatchEvent(event);
  }

  registrarCampo(campo: HTMLElement) {
    this.campos = [...this.campos, campo];
    this.ordenarCampos$.next(null);
  }

  removerCampo(campo: HTMLElement) {
    this.campos = this.campos.filter((c) => c !== campo);
    this.ordenarCampos$.next(null);
  }

  ordenarCampos() {
    const top = (e: any) => (e && (e.getClientRects()[0] || {}).top) || 0;
    this.campos = this.campos.sort((a, b) => top(a) - top(b));
    this.campos.forEach((c, i) => (c.tabIndex = i + 1));
  }

  irParaProximoCampo(campo: HTMLElement, voltar = false) {
    const index = this.campos.indexOf(campo);
    const proximoCampo = this.campos[index + (voltar ? -1 : 1)];

    if (proximoCampo) {
      if ('setFocus' in proximoCampo) {
        (proximoCampo as any).setFocus();
      } else {
        proximoCampo.focus();
      }
    } else {
      campo.blur();
    }
  }

  adicionarErro(campo: HTMLElement, msg: string) {
    const index = this.campos.indexOf(campo);
    this.erros[index] = { msg, campo, index };
  }

  removerErro(campo: HTMLElement) {
    delete this.erros[this.campos.indexOf(campo)];
  }

  private async mostrarErro() {
    const erro = Object.keys(this.erros)
      .map((k) => this.erros[k])
      .reduce((o, v) => (o.index === -1 || o.index > v.index ? v : o), {
        index: -1,
        msg: '',
        campo: null,
      });

    if (erro.index !== -1) {
      if ('setFocus' in erro.campo) {
        (erro.campo as any).setFocus();
      } else {
        erro.campo.focus();
      }

      if ('blur' in erro.campo) {
        setTimeout(() => erro.campo.blur(), 500);
      }
    }
  }
}
