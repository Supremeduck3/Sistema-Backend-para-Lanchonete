import prisma from '../utils/prismaClient.js';

export default class clienteModel {
    constructor({
        id,
        nome,
        telefone,
        email,
        cpf,
        cep,
        logradouro = null,
        bairro = null,
        localidade = null,
        uf = null,
        ativo = true,
    } = {}) {
        ((this.id = id),
            (this.nome = nome),
            (this.telefone = telefone),
            (this.email = email),
            (this.cpf = cpf),
            (this.cep = cep),
            (this.logradouro = logradouro),
            (this.bairro = bairro),
            (this.localidade = localidade),
            (this.uf = uf),
            (this.ativo = ativo));
    }

    async criar() {
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
        return prisma.cliente.delete({ where: { id: this.id } });
    }
    /*
    { id = null, nome, telefone, email = null, cpf = null, cep = null, logradouro = null, bairro = null, localidade = null,uf = null, ativo = true
     }
     */

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) where.nome = { contains: filtros.nome, mode: 'insensitive' };
        if (filtros.email) where.email = { contains: filtros.email, mode: 'insensitive' };
        if (filtros.estado !== undefined) where.estado = filtros.estado === 'true';

        return prisma.cliente.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.cliente.findUnique({ where: { id } });
        if (!data) return null;
        return new ExemploModel(data);
    }
}
