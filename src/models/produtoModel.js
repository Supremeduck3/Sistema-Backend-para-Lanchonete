import prisma from '../utils/prismaClient.js';

export default class ProdutoModel {
    constructor({ id, nome, descricao, categoria, preco, disponivel }) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.categoria = categoria;
        this.preco = preco;
        this.disponivel = disponivel;
    }

    async criar() {
        return prisma.produto.create({
            data: {
                nome: this.nome,
                descricao: this.descricao,
                categoria: this.categoria,
                preco: this.preco,
                disponivel: this.disponivel,
            },
        });
    }

    async atualizar() {
        return prisma.produto.update({
            where: { id: this.id },
            data: {
                nome: this.nome,
                descricao: this.descricao,
                categoria: this.categoria,
                preco: this.preco,
                disponivel: this.disponivel,
            },
        });
    }

    async excluir() {
        return prisma.produto.delete({
            where: { id: this.id },
        });
    }

    static async buscarTodos(filters) {
        const where = {};

        if (filtros.nome) {
            where.nome = {
                contains: filters.nome,
                mode: 'insensitive',
            };
        }

        if (filtros.categoria) {
            where.categoria = filtros.categoria;
        }

        if (filtros.disponivel !== undefined) {
            where.disponivel = filtros.disponivel === 'true';
        }

        if (filtros.precoMin !== undefined || filtros.precoMax !== undefined) {
            where.preco = {};
            if (filtros.precoMin !== undefined) {
                where.preco.gte = parseFloat(filtros.precoMin);
            }
            if (filtros.precoMax !== undefined) {
                where.preco.lte = parseFloat(filtros.precoMax);
            }
        }

        return prisma.produto.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.produto.findUnique({ where: { id } });
        if (!data) return null;
        return new ProdutoModel(data);
    }
}
