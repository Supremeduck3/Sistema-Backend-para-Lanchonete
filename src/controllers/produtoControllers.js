import LanchoneteModel from '../models/lanchoneteModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, descricao, categoria, preco,  } =
            req.body;

        if (!nome || !descricao || !categoria || !preco) {
            return res.status(400).json({
                error: 'Os campos nome, descricao, categoria, preco e  são obrigatórios e não podem estar vazios!',
            });
        }

        const lanchonete = new LanchoneteModel({ nome, categoria, descricao, preco,  });
        const data = await lanchonete.criar();

        return res.status(201).json({ message: 'produto criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o produto.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const produtos = await LanchoneteModel.buscarTodos(req.query);

        if (!produtos || produtos.length === 0) {
            return res.status(200).json({ message: 'Nenhum produto encontrado.' });
        }

        res.json(produtos);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const lanchonete = await LanchoneteModel.buscarPorId(parseInt(id));

        if (!lanchonete) {
            return res.status(404).json({ error: 'produto não encontrado.' });
        }

        res.json({ data: lanchonete });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar produto.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const lanchonete = await LanchoneteModel.buscarPorId(parseInt(id));

        if (!lanchonete) {
            return res.status(404).json({ error: 'produto não encontrado para atualizar.' });
        }

        if (req.body.nome !== undefined) lanchonete.nome = req.body.nome;
        if (req.body.descricao !== undefined) lanchonete.descricao = req.body.descricao;
        if (req.body.categoria !== undefined) lanchonete.categoria = parseFloat(req.body.categoria);
        if (req.body.preco !== undefined) lanchonete.preco = parseFloat(req.body.preco);

        const data = await lanchonete.atualizar();

        res.json({ message: `O produto "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        res.status(500).json({ error: 'Erro ao atualizar produto.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const lanchonete = await LanchoneteModel.buscarPorId(parseInt(id));

        if (!lanchonete) {
            return res.status(404).json({ error: 'produto não encontrado para deletar.' });
        }

        await lanchonete.deletar();

        res.json({ message: `O produto "${lanchonete.nome}" foi deletado com sucesso!`, deletado: lanchonete });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        res.status(500).json({ error: 'Erro ao deletar produto.' });
    }
};
