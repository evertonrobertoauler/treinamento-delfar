import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  nome: string;

  @Column('text')
  usuario: string;

  @Column('text')
  senha: string;
}

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  nome: string;

  @Column('text')
  email: string;

  @Column({ type: 'numeric', precision: 15})
  contato: string;

  @OneToMany(() => Endereco, (endereco) => endereco.cliente)
  enderecos: Endereco[];
}

@Entity()
export class Endereco {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.enderecos, { nullable: false })
  cliente: Cliente;

  @Column('text')
  cidade: string;

  @Column('text')
  rua: string;

  @Column('integer')
  numero: string;

  @Column('text')
  bairro: string;

  @Column('text')
  complemento: string;
}

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.id, { nullable: false })
  cliente: number;
  
  @ManyToOne(() => Endereco, (endereco) => endereco.id, { nullable: false })
  endereco: number;
  
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  valor: string;

  @OneToMany(() => ItemPedido, (item) => item.pedido)
  itens: ItemPedido[];
}

@Entity()
export class ItemPedido {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.itens, { nullable: false })
  pedido: Pedido;

  @Column('text')
  nome: string;

  @Column('integer')
  quantidade: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  valor: string;
}
