import prisma from '../utils/prismaClient.js';

export default class ClienteModel {
    constructor({
        id = null,
        nome,
        telefone,
        email = null,
        cpf = null,
        cep = null,
        logradouro = null,
        bairro = null,
        localidade = null,
        uf = null,
        ativo = true,
    } = {}) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.cpf = cpf;
        this.cep = cep;
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.localidade = localidade;
        this.uf = uf;
        this.ativo = ativo;
    }

    // converter o cep para int
    async buscarEndereco(cep) {
        let ce = String(cep).replace(/\D/g, '');
        if (ce.length !== 9) {
            return { error: 'Formato de CEP inválido (deve ter 9 dígitos)' };
        }

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${ce}/json/`);

            if (!resposta.ok) {
                return { error: 'Erro ao consultar o serviço de CEP (ViaCEP)' };
            }

            const dados = await resposta.json();
            if (dados.erro === 'true' || dados.erro == true) {
                return { error: 'Verifique novamente o cep (Bad request)' };
            }
            this.logradouro = String(dados.logradouro);
            this.bairro = String(dados.bairro);
            this.localidade = String(dados.localidade);
            this.uf = String(dados.uf);
            return null;
        } catch (err) {
            return { error: 'Não foi possível conectar ao serviço de busca' };
        }
    }
    validarNome() {
        if (!this.nome || this.nome.trim().length === 0) {
            return { erro: 'O nome é obrigatório.' };
        }

        const tamanho = this.nome.trim().length;

        if (tamanho < 3 || tamanho > 100) {
            return { erro: 'O nome deve ter entre 3 e 100 caracteres.' };
        }

        return null;
    }

    validarCPF() {
        if (!this.cpf || this.cpf.length < 11 || isNaN(this.cpf) || this.cpf.length > 11)
            return { erro: 'CPF deve conter 11 dígitos numéricos.' };

        return null;
    }

    async validarDuplicidade() {
        let cpf = String(this.cpf);
        const existente = await prisma.cliente.findFirst({
            where: {
                OR: [{ cpf: cpf }, { telefone: this.telefone }],
                NOT: this.id ? { id: this.id } : undefined,
            },
        });

        if (existente) {
            if (existente.cpf === this.cpf) return { erro: 'CPF já cadastrado no sistema.' };

            if (existente.telefone === this.telefone)
                return { erro: 'Telefone já cadastrado para outro cliente.' };
        }

        return null;
    }

    validarTelefone() {
        if (
            !this.telefone ||
            this.telefone.length < 10 ||
            isNaN(this.telefone) ||
            this.telefone.length > 11
        )
            return { erro: 'O telefone deve conter 10 ou 11 dígitos numéricos.' };

        return null;
    }

    validarEmail() {
        if (!this.email) return null;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(this.email)) {
            return { erro: 'O e-mail informado possui um formato inválido.' };
        }

        return null;
    }

    async criar() {
        if (!this.nome) return { erro: "O campo 'nome' é obrigatório." };

        let erro = this.validarCPF();
        if (erro) return erro;

        erro = await this.validarDuplicidade();
        if (erro) return erro;

        const cep = parseInt(this.cep);
        const erroEndereco = await this.buscarEndereco(cep);
        if (erroEndereco) return erroEndereco;

        let cpf = String(this.cpf);
        return prisma.cliente.create({
            data: {
                nome: this.nome,
                telefone: this.telefone,
                email: this.email,
                cpf: cpf,
                cep: String(this.cep),
                logradouro: this.logradouro,
                bairro: this.bairro,
                localidade: this.localidade,
                uf: this.uf,
                ativo: this.ativo,
            },
        });
    }

    async atualizar() {
        if (!this.id) return { erro: 'ID inválido. Informe um número válido.' };

        let erro = this.validarCPF();
        if (erro) return erro;

        erro = this.validarCEP();
        if (erro) return erro;

        erro = this.validarDuplicidade();
        if (erro) return erro;

        return prisma.cliente.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                telefone: this.telefone,
                email: this.email,
                cpf: this.cpf,
                cep: this.cep,
                logradouro: this.logradouro,
                bairro: this.bairro,
                localidade: this.localidade,
                uf: this.uf,
                ativo: this.ativo,
            },
        });
    }

    async deletar() {
        if (!this.id) return { erro: 'ID inválido. Informe um número válido.' };

        const pedidoAberto = await prisma.pedido.findFirst({
            where: {
                clienteId: this.id,
                status: 'ABERTO',
            },
        });

        if (pedidoAberto) return { erro: 'Não pode deletar cliente com pedido em status ABERTO.' };

        return prisma.cliente.delete({ where: { id: this.id } });
    }

    async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }

        if (filtros.cpf) {
            where.cpf = filtros.cpf;
        }

        if (filtros.ativo !== undefined) {
            where.ativo = filtros.ativo === 'true';
        }

        return prisma.cliente.findMany({ where });
    }

    static async buscarPorId(id) {
        if (!id) return { erro: 'ID inválido. Informe um número válido.' };

        const data = await prisma.cliente.findUnique({ where: { id } });

        if (!data) return null;

        return new ClienteModel(data);
    }
    static async buscarEndereco(cep) {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await resposta.json();

        return dados;
    }
}
