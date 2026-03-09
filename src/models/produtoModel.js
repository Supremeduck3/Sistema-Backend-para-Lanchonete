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

    validar() {
        if (!this.nome || this.nome.length < 3) {
            throw new Error('O campo "nome" é obrigatório e deve conter pelo menos 3 caracteres.');
        }
        if (!this.descricao || this.descricao.length > 255) {
            throw new Error(
                'O campo "descricao" é obrigatório e deve conter no máximo 255 caracteres.',
            );
        }
        if (this.preco === undefined || this.preco <= 0) {
            throw new Error('O campo "preco" deve ser um número maior que zero.');
        }

        if (Math.floor(this.preco * 100) !== Math.round(this.preco * 1000) / 10) {
            if (Math.floor(this.preco * 100) !== this.preco * 100) {
                throw new Error('Preço inválido. Use no máximo 2 casas decimais.');
            }
        }
        if (this.disponivel === undefined) {
            throw new Error('O campo "disponivel" é obrigatório.');
        }
    }

    async criar() {
        this.validar();
        if (this.disponivel === false) {
            throw new Error('O campo "disponivel" não pode ser false ao criar um produto.');
        }

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
        this.validar();
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

    async deletar() {
        // Agora o Prisma reconhece o campo 'pedido' e o campo 'produtoId'
        const itemEmAberto = await prisma.itemPedido.findFirst({
            where: {
                produtoId: this.id,
                pedido: {
                    status: 'ABERTO',
                },
            },
        });

        if (itemEmAberto) {
            throw new Error(
                'Não é possível deletar este produto, pois ele está em um pedido aberto.',
            );
        }

        return prisma.produto.delete({
            where: { id: this.id },
        });
    }

    static async buscarTodos(filtros) {
        const where = {};
        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }
        if (filtros.categoria) {
            where.categoria = filtros.categoria;
        }
        if (filtros.disponivel !== undefined) {
            where.disponivel = filtros.disponivel === 'true';
        }
        if (filtros.precoMin !== undefined || filtros.precoMax !== undefined) {
            where.preco = {};
            if (filtros.precoMin !== undefined) where.preco.gte = parseFloat(filtros.precoMin);
            if (filtros.precoMax !== undefined) where.preco.lte = parseFloat(filtros.precoMax);
        }
        return prisma.produto.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.produto.findUnique({ where: { id } });
        if (!data) return null;
        return new ProdutoModel(data);
    }
}
