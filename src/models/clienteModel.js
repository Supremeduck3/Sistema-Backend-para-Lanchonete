import prisma from '../utils/prismaClient.js';
 async function buscarEndereco(cep) {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resposta.json();

    return cep
 }
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

    validarNome() {
        if (this.nome || this.nome.trim().length === 0) {
            return { erro: 'O nome é obrigatório.' };
        }

        const tamanho = this.nome.trim().length;

        if (tamanho < 3 || tamanho > 100) {
            return { erro: 'O nome deve ter entre 3 e 100 caracteres.' };
        }

        return null;
    }

    validarCPF() {
        if (!this.cpf || this.cpf.length !== 11 || isNaN(this.cpf))
            return { erro: 'CPF deve conter 11 dígitos numéricos.' };

        return null;
    }

    validarCEP() {
        if (!this.cep || this.cep.length !== 8 || isNaN(this.cep))
            return { erro: 'CEP deve conter exatamente 8 dígitos numéricos.' };

        return null;
    }

    async validarDuplicidade() {
        const existente = await prisma.cliente.findFirst({
            where: {
                OR: [{ cpf: this.cpf }, { telefone: this.telefone }],
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

    async criar() {
        if (!this.nome) return { erro: "O campo 'nome' é obrigatório." };

        let erro = this.validarCPF();
        if (erro) return erro;

        erro = this.validarCEP();
        if (erro) return erro;

        erro = await this.validarDuplicidade();
        if (erro) return erro;

        return prisma.cliente.create({
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

    async atualizar() {
        if (!this.id) return { erro: 'ID inválido. Informe um número válido.' };

        let erro = this.validarCPF();
        if (erro) return erro;

        erro = this.validarCEP();
        if (erro) return erro;

        erro = await this.validarDuplicidade();
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

        if (filtros.nome) where.nome = { contains: filtros.nome, mode: 'insensitive' };

        if (filtros.email) where.email = { contains: filtros.email, mode: 'insensitive' };

        if (filtros.cpf) where.cpf = filtros.cpf;

        if (filtros.ativo !== undefined) where.ativo = filtros.ativo === 'true';

        return prisma.cliente.findMany({ where });
    }

    async buscarPorId(id) {
        if (!id) return { erro: 'ID inválido. Informe um número válido.' };

        const data = await prisma.cliente.findUnique({ where: { id } });

        if (!data) return null;

        return new ClienteModel(data);
    }
}
