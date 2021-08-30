export type TIPO_VALOR = 'valor' | 'inteiro' | 'percentual';

export const PRECISAO_VALOR: { [tipo in TIPO_VALOR]: number | null } = {
  inteiro: 0,
  percentual: 1,
  valor: 2
};

export interface Opcao {
  valor: any;
  label: string;
  extras?: { [key: string]: any };
}
