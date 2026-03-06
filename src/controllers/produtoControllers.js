import ProdutoModel from '../models/produtoModel.js';

export const criar = async (req, res) => {
    try {
        const produto = new ProdutoModel(req.body);
        const data = await produto.criar();
        return res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
        return res.status(400).json({ error: error.message });
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
        res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const produto = await ProdutoModel.buscarPorId(parseInt(id));
        if (!produto) return res.status(404).json({ error: 'Registro não encontrado.' });

        res.json({ data: produto });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar registro.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const produto = await ProdutoModel.buscarPorId(parseInt(id));
        if (!produto) return res.status(404).json({ error: 'Registro não encontrado.' });

        Object.assign(produto, req.body);

        const data = await produto.atualizar();
        res.json({ message: `O registro "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(id)) return res.status(400).json({ error: 'ID inválido.' });

        const produto = await ProdutoModel.buscarPorId(parseInt(id));
        if (!produto) return res.status(404).json({ error: 'Registro não encontrado.' });

        await produto.deletar();
        res.json({ message: `O registro "${produto.nome}" foi deletado com sucesso!` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
