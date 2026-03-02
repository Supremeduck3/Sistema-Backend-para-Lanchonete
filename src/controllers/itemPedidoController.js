import LanchoneteModel from '../models/lanchoneteModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { pedidoId, produtoId, quantidade, precoUnitario,  } = req.body;

        if (!pedidoId || !produtoId || !quantidade || !precoUnitario ) {
            return res.status(400).json({
                error: 'Os campos nome, telefone, email, cpf e cep são obrigatórios e não podem estar vazios!',
            });
        }

        const lanchonete = new LanchoneteModel({ nome, email, telefone, cpf, cep });
        const data = await lanchonete.criar();

        return res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o registro.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await LanchoneteModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(200).json({ message: 'Nenhum registro encontrado.' });
        }

        res.json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        res.status(500).json({ error: 'Erro ao buscar registros.' });
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
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        res.json({ data: lanchonete });
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

        const lanchonete = await LanchoneteModel.buscarPorId(parseInt(id));

        if (!lanchonete) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }

        if (req.body.nome !== undefined) lanchonete.nome = req.body.nome;
        if (req.body.telefone !== undefined) lanchonete.telefone = req.body.telefone;
        if (req.body.email !== undefined) lanchonete.email = parseFloat(req.body.email);
        if (req.body.cpf !== undefined) lanchonete.cpf = parseFloat(req.body.cpf);
        if (req.body.cep !== undefined) lanchonete.cep = parseFloat(req.body.cep);
        if (req.body.logradouro !== undefined) lanchonete.logradouro = parseFloat(req.body.logradouro);
        if (req.body.bairro !== undefined) lanchonete.bairro = parseFloat(req.body.bairro);
        if (req.body.localidade !== undefined) lanchonete.localidade = parseFloat(req.body.localidade);
        if (req.body.uf !== undefined) lanchonete.uf = parseFloat(req.body.uf);
        if (req.body.ativo !== undefined) lanchonete.ativo = parseFloat(req.body.ativo);

        const data = await lanchonete.atualizar();

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

        const lanchonete = await LanchoneteModel.buscarPorId(parseInt(id));

        if (!lanchonete) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        await lanchonete.deletar();

        res.json({ message: `O registro "${lanchonete.nome}" foi deletado com sucesso!`, deletado: lanchonete });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};
