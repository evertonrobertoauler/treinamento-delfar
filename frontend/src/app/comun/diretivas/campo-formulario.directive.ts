import { Directive, AfterViewInit, OnDestroy } from '@angular/core';
import { ElementRef, Renderer2, Optional } from '@angular/core';
import { NgControl, FormControlName } from '@angular/forms';
import { Subscription, fromEvent, merge, timer } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { FormularioDirective } from './formulario.directive';

@Directive({
  selector: '[appCampoFormulario]',
})
export class CampoFormularioDirective implements AfterViewInit, OnDestroy {
  mudancas: Subscription;
  fecharTeclado: Subscription;

  div: any;

  private campo: HTMLElement;

  constructor(
    private formulario: FormularioDirective,
    private el: ElementRef,
    private renderer: Renderer2,
    @Optional() private ngControl: NgControl
  ) {}

  async ngAfterViewInit() {
    this.campo = this.el.nativeElement;

    if (this.campo.nodeName.toLowerCase() === 'form-campo-numerico') {
      this.campo = this.campo.children[0] as HTMLElement;
    }

    if (this.ngControl instanceof FormControlName) {
      this.criarDivErro();

      this.formulario.registrarCampo(this.campo);

      const mudancas$ = merge(
        fromEvent(this.campo, 'blur').pipe(debounceTime(700)),
        fromEvent(this.campo, 'focus'),
        this.ngControl.statusChanges,
        this.formulario.onSubmit$
      );

      await timer(500).toPromise();

      this.mudancas = mudancas$.subscribe(async (e) => {
        const mostrar =
          (this.ngControl.touched ||
            (e instanceof Event && ['blur', 'submit'].includes(e.type))) &&
          this.campo !== document.activeElement;

        if (mostrar && this.ngControl.control.errors) {
          this.mostrarErro(this.ngControl.control.errors);
        } else {
          this.removerErro();
        }
      });
    } else {
      this.formulario.registrarCampo(this.campo);
    }
  }

  ngOnDestroy() {
    this.formulario.removerCampo(this.campo);

    if (this.fecharTeclado instanceof Subscription) {
      this.fecharTeclado.unsubscribe();
    }

    if (this.mudancas instanceof Subscription) {
      this.mudancas.unsubscribe();
    }
  }

  criarDivErro() {
    this.div = this.renderer.createElement('div');
    this.renderer.addClass(this.div, 'campo-formulario-erro');
    this.renderer.appendChild(this.el.nativeElement.parentElement, this.div);
  }

  mostrarErro(errors: any) {
    const msg = this.formatObjToMsg(errors);

    this.renderer.setStyle(this.div, 'display', 'block');
    this.renderer.setStyle(this.div, 'white-space', 'pre-wrap');
    this.renderer.setProperty(this.div, 'textContent', msg);
    this.renderer.setStyle(this.el.nativeElement, 'margin-bottom', '0');
    this.renderer.addClass(
      this.el.nativeElement.parentElement,
      'campo-formulario'
    );

    if (this.formulario) {
      this.formulario.adicionarErro(this.campo, msg);
    }
  }

  removerErro() {
    this.renderer.setStyle(this.div, 'display', 'none');
    this.renderer.removeStyle(this.el.nativeElement, 'margin-bottom');
    this.renderer.removeClass(
      this.el.nativeElement.parentElement,
      'campo-formulario'
    );

    if (this.formulario) {
      this.formulario.removerErro(this.campo);
    }
  }

  formatObjToMsg(obj: any): string {
    return Object.keys(obj)
      .map((key) => this.formatMsg(key, obj[key]))
      .join('\n');
  }

  formatMsg(key: string, value: any) {
    switch (key) {
      case 'required':
        return 'Campo Obrigat??rio!';
      case 'obrigatorio':
        return 'Campo Obrigat??rio, espa??os em branco n??o s??o considerados!';
      case 'minlength':
        return `Informe no m??nimo ${value.requiredLength} caract??res!`;
      case 'maxlength':
        return `Informe no m??ximo ${value.requiredLength} caract??res!`;
      case 'min':
        return `Valor m??nimo permitido n??o deve ser inferior a ${value.min}!`;
      case 'max':
        return `Valor m??ximo permitido n??o deve ser superior a ${value.max}!`;
      case 'pattern':
        return `Informe um valor v??lido para a seguinte express??o regular ${value.requiredPattern}!`;
      case 'email':
        return 'E-mail inv??lido!';
      case 'cep':
        return 'CEP incompleto!';
      case 'placa':
        return 'Placa inv??lida!';
      case 'cpf':
        return 'CPF inv??lido!';
      case 'cnpj':
        return 'CNPJ inv??lido!';
      case 'telefone':
        return 'N??mero de telefone incompleto!';
      case 'celular':
        return 'Celular incompleto, n??o esque??a do c??digo de ??rea e do nono d??gito, ex: (00) 00000-0000!';
      case 'diaMes':
        const { diferente: d1, valor: v1 } = value;
        return d1
          ? `Data inv??lida, data informada ${v1} seria interpretada como ${d1}!`
          : 'Data incompleta, ex: 00/00!';
      case 'horasMinutos':
        const { diferente: d2, valor: v2 } = value;
        return d2
          ? `Hor??rio inv??lido, hor??rio informado ${v2} seria interpretado como ${d2}!`
          : 'Hor??rio incompleto, ex: 00:00!';
      case 'senhasIguais':
        return 'Senhas diferentes!';
      case 'customizado':
        return value?.mensagem || 'Valor inv??lido!';
      default:
        return 'Valor inv??lido!';
    }
  }
}
