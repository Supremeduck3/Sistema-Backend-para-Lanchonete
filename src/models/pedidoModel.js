import prisma from '../utils/prismaClient.js';

class PedidoModel {
    constructor({ id, clienteId, total = 0, status = 'ABERTO', criadoEm }) {
        this.id = id;
        this.clienteId = clienteId;
        this.total = total;
        this.status = status;
        this.criadoEm = criadoEm;
    }

    async criar() {
        const cliente = await prisma.cliente.findUnique({
            where: { id: this.clienteId },
        });

        if (!cliente) {
            return { erro: 'Cliente não encontrado.' };
        }

        if (!cliente.ativo) {
            return { erro: 'Não é possível criar pedido para cliente inativo.' };
        }

        const pedido = await prisma.pedido.create({
            data: {
                clienteId: this.clienteId,
                status: 'ABERTO',
                total: 0,
            },
        });

        return pedido;
    }

    static async buscarTodos(filtros) {
        const where = {};

        if (filtros.clienteId) {
            where.clienteId = parseInt(filtros.clienteId);
        }

        if (filtros.status) {
            where.status = filtros.status;
        }

        const pedidos = await prisma.pedido.findMany({
            where,
            include: {
                itens: true,
            },
        });

        return pedidos;
    }

    static async buscarPorId(id) {
        const pedido = await prisma.pedido.findUnique({
            where: { id },
            include: {
                itens: true,
            },
        });

        if (!pedido) {
            return { erro: 'Pedido não encontrado.' };
        }

        return pedido;
    }

    async cancelar() {
        const pedido = await prisma.pedido.findUnique({
            where: { id: this.id },
        });

        if (!pedido) {
            return { erro: 'Pedido não encontrado.' };
        }

        if (pedido.status !== 'ABERTO') {
            return { erro: 'Só é possível cancelar pedidos com status ABERTO.' };
        }

        const pedidoCancelado = await prisma.pedido.update({
            where: { id: this.id },
            data: { status: 'CANCELADO' },
        });

        return pedidoCancelado;
    }

    async pagar() {
        const pedido = await prisma.pedido.findUnique({
            where: { id: this.id },
        });

        if (!pedido) {
            return { erro: 'Pedido não encontrado.' };
        }

        if (pedido.status !== 'ABERTO') {
            return { erro: 'Somente pedidos ABERTOS podem ser pagos.' };
        }

        const pedidoPago = await prisma.pedido.update({
            where: { id: this.id },
            data: { status: 'PAGO' },
        });

        return pedidoPago;
    }

    static validarAdicaoItem(pedido) {
        if (!pedido) {
            return { erro: 'Pedido não encontrado.' };
        }

        if (pedido.status === 'PAGO' || pedido.status === 'CANCELADO') {
            return { erro: 'Não é possível adicionar itens a um pedido PAGO ou CANCELADO.' };
        }

        return true;
    }
}

export default PedidoModel;
