import prisma from '../utils/prisma.js';

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
            throw new Error('Cliente não encontrado.');
        }

        if (!cliente.ativo) {
            throw new Error('Não é possível criar pedido para cliente inativo.');
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

        return pedido;
    }


    async cancelar() {
        const pedido = await prisma.pedido.findUnique({
            where: { id: this.id },
        });

        if (!pedido) {
            throw new Error('Pedido não encontrado.');
        }

        if (pedido.status !== 'ABERTO') {
            throw new Error('Só é possível cancelar pedidos com status ABERTO.');
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
            throw new Error('Pedido não encontrado.');
        }

        if (pedido.status !== 'ABERTO') {
            throw new Error('Somente pedidos ABERTOS podem ser pagos.');
        }

        const pedidoPago = await prisma.pedido.update({
            where: { id: this.id },
            data: { status: 'PAGO' },
        });

        return pedidoPago;
    }


    static validarAdicaoItem(pedido) {
        if (!pedido) {
            throw new Error('Pedido não encontrado.');
        }

        if (pedido.status === 'PAGO' || pedido.status === 'CANCELADO') {
            throw new Error('Não é possível adicionar itens a um pedido PAGO ou CANCELADO.');
        }
    }
}

export default PedidoModel;
