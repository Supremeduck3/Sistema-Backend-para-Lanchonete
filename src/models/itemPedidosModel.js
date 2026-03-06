import prisma from '../utils/prismaClient.js';

export default class itemPedidoModel {
    constructor({
        id,
        pedidoId,
        produtoId,
        quantidade,
        precoUnitario,
    } = {}) {
        ((this.id = id),
            (this.pedidoId = pedidoId),
            (this.produtoId = produtoId),
            (this.quantidade = quantidade),
            (this.precoUnitario = precoUnitario));
    }

    async criar() {
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
        return prisma.itemPedido.delete({ where: { id: this.id } });
    }
    /*
    { id = null, nome, telefone, email = null, cpf = null, cep = null, logradouro = null, bairro = null, localidade = null,uf = null, ativo = true
     }
     */

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.pedidoId) where.pedidoId = { contains: filtros.pedidoId, mode: 'insensitive' };
        if (filtros.produtoId) where.produtoId = { contains: filtros.produtoId, mode: 'insensitive' };
        if (filtros.quantidade !== undefined) where.quantidade = filtros.quantidade === 'true';
        if (filtros.precoUnitario !== undefined) where.precoUnitario = parseInt(filtros.precoUnitario);

        return prisma.itemPedido.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.itemPedido.findUnique({ where: { id } });
        if (!data) return null;
        return new itemPedidoModel(data);
    }
}
