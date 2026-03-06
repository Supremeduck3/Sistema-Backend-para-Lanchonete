import prisma from '../utils/prismaClient.js';

export default class itemPedidoModel {
    constructor({ id, pedidoId, produtoId, quantidade, precoUnitario } = {}) {
        (this.id = id),
            (this.pedidoId = pedidoId),
            (this.produtoId = produtoId),
            (this.quantidade = quantidade),
            (this.precoUnitario = precoUnitario);
    }

    validarQuantidade() {
        if (this.quantidade <= 0) {
            throw new Error('A quantidade deve ser maior que 0.');
        }
        if (this.quantidade > 99) {
            throw new Error('A quantidade pode ser no máximo 99 itens.');
        }
    }

    async produtoDisponivel() {
        const produto = await prisma.produto.findUnique({
            where: { id: this.produtoId },
        });

        if (!produto) {
            throw new Error('Produto não encontrado.');
        }

        if (produto.disponivel === false) {
            throw new Error('Não é possível adicionar um produto indisponível');
        }
    }

    async removerPedido() {
        const produto = await prisma.pedido.findUnique({
            where: { id: this.pedidoId },
        });

        if (!pedido) {
            throw new Error('Pedido não encontrado.');
        }
        if (pedido.status === 'PAGO' || pedido.status === 'CANCELADO') {
            throw new Error('Não é possível remover um item pago ou cancelado');
        }
    }

    async definirPrecoUni() {
        const produto = await prisma.produto.findUnique({
            where: { id: this.produtoId },
        });

        if (!produto) {
            throw new Error('Produto não encontrado.')
        }

        this.precoUnitario = produto.preco;
    }

    async criar() {
        this.validarQuantidade();
        await this.produtoDisponivel();
        await this.definirPrecoUni();

        return prisma.itemPedido.create({
            data: {
                pedidoId: this.pedidoId,
                produtoId: this.produtoId,
                quantidade: this.quantidade,
                precoUnitario: this.precoUnitario,
            },
        });
    }

    async atualizar() {
        this.validarQuantidade();

        return prisma.itemPedido.update({
            where: { id: this.id },
            data: {
                pedidoId: this.pedidoId,
                produtoId: this.produtoId,
                quantidade: this.quantidade,
                precoUnitario: this.precoUnitario,
            },
        });
    }

    async deletar() {
        await this.removerPedido();
        return prisma.itemPedido.delete({ where: { id: this.id } });
    }
    /*
    { id = null, nome, telefone, email = null, cpf = null, cep = null, logradouro = null, bairro = null, localidade = null,uf = null, ativo = true
     }
     */

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.pedidoId) where.pedidoId = { contains: filtros.pedidoId, mode: 'insensitive' };
        if (filtros.produtoId)
            where.produtoId = { contains: filtros.produtoId, mode: 'insensitive' };
        if (filtros.quantidade !== undefined) where.quantidade = filtros.quantidade === 'true';
        if (filtros.precoUnitario !== undefined)
            where.precoUnitario = parseInt(filtros.precoUnitario);

        return prisma.itemPedido.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.itemPedido.findUnique({ where: { id } });
        if (!data) return null;
        return new itemPedidoModel(data);
    }
}
