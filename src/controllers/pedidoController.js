import pedidoModel from '../models/pedidoModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                erro: 'Corpo da requisição vazio. Envie os dados!',
            });
        }

        const { clienteId } = req.body;

        if (!clienteId) {
            return res.status(400).json({
                erro: "O campo 'clienteId' é obrigatório.",
            });
        }

        if (isNaN(clienteId)) {
            return res.status(400).json({
                erro: 'ID inválido. Informe um número válido.',
            });
        }

        const pedido = new pedidoModel({ clienteId });
        const data = await pedido.criar();

        return res.status(201).json({
            message: 'Pedido criado com sucesso!',
            data,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            erro: 'Erro interno ao criar pedido.',
        });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const { status, clienteId } = req.query;

        if (!status && !clienteId) {
            return res.status(400).json({
                erro: 'Informe pelo menos um parâmetro para filtro.',
            });
        }

        const pedidos = await pedidoModel.buscarTodos(req.query);

        if (!pedidos || pedidos.length === 0) {
            return res.status(200).json({
                mensagem: 'Nenhum pedido encontrado.',
            });
        }

        return res.status(200).json(pedidos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            erro: 'Erro interno ao buscar pedidos.',
        });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({
                erro: 'ID inválido. Informe um número válido.',
            });
        }

        const pedido = await pedidoModel.buscarPorId(Number(id));

        if (!pedido) {
            return res.status(404).json({
                erro: 'Pedido não encontrado.',
            });
        }

        return res.status(200).json({ data: pedido });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            erro: 'Erro interno ao buscar pedido.',
        });
    }
};

export const pagar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({
                erro: 'ID inválido. Informe um número válido.',
            });
        }

        const pedido = await pedidoModel.buscarPorId(Number(id));

        if (!pedido) {
            return res.status(404).json({
                erro: 'Pedido não encontrado.',
            });
        }

        if (pedido.status !== 'ABERTO') {
            return res.status(400).json({
                erro: 'Somente pedidos ABERTOS podem ser pagos.',
            });
        }

        const pedidosModel = new pedidoModel({
            id: pedido.id,
            status: 'PAGO',
        });

        const data = await pedidosModel.atualizarStatus();

        return res.status(200).json({
            message: 'Pedido pago com sucesso!',
            data,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            erro: 'Erro interno ao pagar pedido.',
        });
    }
};

export const cancelar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({
                erro: 'ID inválido. Informe um número válido.',
            });
        }

        const pedidosModel = new pedidoModel({
            id: Number(id),
        });

        const data = await pedidosModel.cancelar();

        return res.status(200).json({
            message: 'Pedido cancelado com sucesso!',
            data,
        });
    } catch (error) {
        return res.status(400).json({
            erro: error.message,
        });
    }
};
