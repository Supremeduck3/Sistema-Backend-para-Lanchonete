import prisma from '../utils/prisma.js';
import pedidoModel from './pedidoModel.js';

class ItempedidoModel {
    constructor({ id, pedidoId, produtoId, quantidade, precoUnitario }) {
        this.id = id;
        this.pedidoId = pedidoId;
        this.produtoId = produtoId;
        this.quantidade = quantidade;
        this.precoUnitario = precoUnitario;
    }


    async criar() {

        const pedido = await prisma.pedido.findUnique({
            where: { id: this.pedidoId },
        });

        if (!pedido) {
            throw new Error('Pedido não encontrado.');
        }


        pedidoModel.validarAdicaoItem(pedido);

        const produto = await prisma.produto.findUnique({
            where: { id: this.produtoId },
        });

        if (!produto) {
            throw new Error('Produto não encontrado.');
        }

        if (!produto.disponivel) {
            throw new Error('Produto indisponível não pode ser adicionado ao pedido.');
        }

        const itemCriado = await prisma.itemPedido.create({
            data: {
                pedidoId: this.pedidoId,
                produtoId: this.produtoId,
                quantidade: this.quantidade,
                precoUnitario: produto.preco,
            },
        });

        await ItempedidoModel.recalcularTotalPedido(this.pedidoId);

        return itemCriado;
    }

    async deletar() {
        const item = await prisma.itemPedido.findUnique({
            where: { id: this.id },
        });

        if (!item) {
            throw new Error('Item do pedido não encontrado.');
        }

        const pedido = await prisma.pedido.findUnique({
            where: { id: item.pedidoId },
        });

        pedidoModel.validarAdicaoItem(pedido);

        await prisma.itemPedido.delete({
            where: { id: this.id },
        });

        await ItempedidoModel.recalcularTotalPedido(item.pedidoId);
    }

    static async buscarPorPedido(pedidoId) {
        return await prisma.itemPedido.findMany({
            where: { pedidoId },
        });
    }

    static async recalcularTotalPedido(pedidoId) {
        const itens = await prisma.itemPedido.findMany({
            where: { pedidoId },
        });

        const total = itens.reduce((soma, item) => {
            return soma + item.quantidade * item.precoUnitario;
        }, 0);

        await prisma.pedido.update({
            where: { id: pedidoId },
            data: { total },
        });

        return total;
    }
}

export default ItempedidoModel;
