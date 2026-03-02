import ProdutoModel from '../models/produtoModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, descricao, categoria, preco, disponivel } = req.body;

        if (!nome || !descricao || !categoria || !preco || disponivel === undefined) {
            return res.status(400).json({
                error: 'Os campos nome, descricao, categoria, preco e disponivel são obrigatórios e não podem estar vazios!',
            });
        }
        // Regras de Negocio
        if (preco <= 0) {
            return res.status(400).json({
                error: 'O campo "preco" deve ser um número maior que zero.',
            });
        }

        if (disponivel === false) {
            return res.status(400).json({
                error: 'O campo "disponivel" não pode ser false ao criar um produto.',
            });
        }

        const produto = new ProdutoModel({ nome, categoria, descricao, preco, disponivel });
        const data = await produto.criar();

        return res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o registro.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const produtos = await ProdutoModel.buscarTodos(req.query);

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

        const produto = await ProdutoModel.buscarPorId(parseInt(id));

        if (!produto) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        res.json({ data: produto });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registro.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const produto = await ProdutoModel.buscarPorId(parseInt(id));

        if (!produto) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }

        if (req.body.nome !== undefined) produto.nome = req.body.nome;
        if (req.body.descricao !== undefined) produto.descricao = req.body.descricao;
        if (req.body.categoria !== undefined) produto.categoria = req.body.categoria;
        if (req.body.preco !== undefined) produto.preco = parseFloat(req.body.preco);
        if (req.body.disponivel !== undefined) produto.disponivel = req.body.disponivel;

        const data = await produto.atualizar();

        res.json({ message: `O registro "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const produto = await ProdutoModel.buscarPorId(parseInt(id));

        if (!produto) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        await produto.deletar();

        res.json({
            message: `O registro "${produto.nome}" foi deletado com sucesso!`,
            deletado: produto,
        });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};
