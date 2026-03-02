import lanchoneteModel from '../models/lanchoneteModel.js';

class PedidoController {

    static async criar(req, res) {
        try {
            const { clienteId } = req.body;

            if (!clienteId) {
                return res.status(400).json({ erro: "O campo 'clienteId' é obrigatório." });
            }

            if (isNaN(clienteId)) {
                return res.status(400).json({ erro: 'ID inválido. Informe um número válido.' });
            }

            const pedido = await PedidoModel.criar({
                clienteId,
                status: 'ABERTO',
            });

            return res.status(201).json(pedido);
        } catch {
            return res.status(500).json({ erro: 'Erro interno ao criar pedido.' });
        }
    }


    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({ erro: 'ID inválido. Informe um número válido.' });
            }

            const pedido = await PedidoModel.buscarPorId(Number(id));

            if (!pedido) {
                return res.status(404).json({ erro: 'Pedido não encontrado.' });
            }

            return res.status(200).json(pedido);
        } catch {
            return res.status(500).json({ erro: 'Erro interno ao buscar pedido.' });
        }
    }


    static async listar(req, res) {
        try {
            const { status, clienteId } = req.query;

            if (!status && !clienteId) {
                return res.status(400).json({
                    erro: 'Informe pelo menos um parâmetro para filtro.',
                });
            }

            const pedidos = await PedidoModel.filtrar({
                status,
                clienteId,
            });

            if (pedidos.length === 0) {
                return res.status(200).json({
                    mensagem: 'Nenhum pedido encontrado.',
                });
            }

            return res.status(200).json(pedidos);
        } catch {
            return res.status(500).json({ erro: 'Erro interno ao listar pedidos.' });
        }
    }


    static async pagar(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({ erro: 'ID inválido. Informe um número válido.' });
            }

            const pedido = await PedidoModel.buscarPorId(Number(id));

            if (!pedido) {
                return res.status(404).json({ erro: 'Pedido não encontrado.' });
            }

            if (pedido.status !== 'ABERTO') {
                return res.status(400).json({
                    erro: 'Somente pedidos ABERTOS podem ser pagos.',
                });
            }

            const pedidoPago = await PedidoModel.atualizarStatus(Number(id), 'PAGO');

            return res.status(200).json(pedidoPago);
        } catch {
            return res.status(500).json({ erro: 'Erro interno ao pagar pedido.' });
        }
    }


    static async cancelar(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({ erro: 'ID inválido. Informe um número válido.' });
            }

            const pedido = await PedidoModel.buscarPorId(Number(id));

            if (!pedido) {
                return res.status(404).json({ erro: 'Pedido não encontrado.' });
            }

            if (pedido.status !== 'ABERTO') {
                return res.status(400).json({
                    erro: 'Só é possível cancelar pedidos com status ABERTO.',
                });
            }

            const pedidoCancelado = await PedidoModel.atualizarStatus(Number(id), 'CANCELADO');

            return res.status(200).json(pedidoCancelado);
        } catch {
            return res.status(500).json({ erro: 'Erro interno ao cancelar pedido.' });
        }
    }
}

export default PedidoController;
