# Sistema Backend para Lanchonete

Um sistema CRUD completo para gerenciamento de uma lanchonete, desenvolvido com Node.js, Express e
Prisma ORM.

## 📋 Descrição

Este projeto implementa um backend RESTful para uma lanchonete, permitindo o gerenciamento de
clientes, produtos, pedidos e itens de pedido. O sistema inclui validações de negócio e utiliza
PostgreSQL como banco de dados.

## 🚀 Funcionalidades

- **Gerenciamento de Clientes**: CRUD completo com validações de CPF, telefone e email únicos
- **Gerenciamento de Produtos**: CRUD com categorias (Lanche, Bebida, Sobremesa, Combo) e controle
  de disponibilidade
- **Gerenciamento de Pedidos**: Criação, listagem, pagamento e cancelamento de pedidos
- **Gerenciamento de Itens de Pedido**: Adição de produtos aos pedidos com validações

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **Dotenv** - Gerenciamento de variáveis de ambiente

## 🗄️ Modelo de Dados

```
Cliente
├── id (PK)
├── nome
├── telefone (unique)
├── email (unique, optional)
├── cpf (unique, optional)
├── cep
├── logradouro
├── bairro
├── localidade
├── uf
└── ativo (default: true)

Produto
├── id (PK)
├── nome
├── descricao
├── categoria (enum)
├── preco (decimal 10,2)
└── disponivel (boolean)

Pedido
├── id (PK)
├── clienteId (FK)
├── total (decimal 10,2)
├── status (enum: ABERTO, PAGO, CANCELADO)
└── criadoEm (datetime)

ItemPedido
├── id (PK)
├── pedidoId (FK)
├── produtoId (FK)
├── quantidade
└── precoUnitario (decimal 10,2)
``
```
