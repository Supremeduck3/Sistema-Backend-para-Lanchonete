import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Resetando tabela exemplo...');

    await prisma.itemPedido.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.produto.deleteMany();
    await prisma.cliente.deleteMany();

    console.log('📦 Inserindo novos registros...');

    await prisma.cliente.createMany({
        data: [
            {
                nome: 'Lucas Oliveira',
                telefone: '11988887777',
                email: 'lucas.oliveira@email.com',
                cpf: '123.456.789-01',
                cep: '01310100',
                ativo: true,
            },
            {
                nome: 'Mariana Souza',
                telefone: '21977776666',
                email: 'mari.souza@provedor.net',
                cpf: '234.567.890-12',
                cep: '20040002',
                ativo: true,
            },
            {
                nome: 'Ricardo Mendes',
                telefone: '31966665555',
                email: 'mendes.ricardo@empresa.com.br',
                cpf: '345.678.901-23',
                cep: '30140010',
                ativo: true,
            },
            {
                nome: 'Beatriz Lopes',
                telefone: '11955554444',
                email: 'bi.lopes@gmail.com',
                cpf: '456.789.012-34',
                cep: '04571010',
                ativo: true,
            },
            {
                nome: 'Carlos Eduardo',
                telefone: '11944443333',
                email: 'cadu@uol.com.br',
                cpf: '567.890.123-45',
                cep: '01001000',
                ativo: false,
            },
        ],
    });

    // 3. CREATE MANY - PRODUTOS
    await prisma.produto.createMany({
        data: [
            {
                nome: 'X-Burger Mega',
                descricao: 'Pão artesanal, blend 180g e muito queijo',
                categoria: 'LANCHE',
                preco: 28.9,
                disponivel: true,
            },
            {
                nome: 'Batata Rústica',
                descricao: 'Batatas com ervas e sal grosso',
                categoria: 'LANCHE',
                preco: 15.0,
                disponivel: true,
            },
            {
                nome: 'Coca-Cola 2L',
                descricao: 'Garrafa família',
                categoria: 'BEBIDA',
                preco: 14.0,
                disponivel: true,
            },
            {
                nome: 'Suco de Laranja',
                descricao: '500ml natural',
                categoria: 'BEBIDA',
                preco: 9.5,
                disponivel: true,
            },
            {
                nome: 'Milkshake Chocolate',
                descricao: 'Feito com sorvete premium',
                categoria: 'SOBREMESA',
                preco: 19.9,
                disponivel: true,
            },
            {
                nome: 'Brownie com Sorvete',
                descricao: 'Brownie quente e sorvete de baunilha',
                categoria: 'SOBREMESA',
                preco: 16.0,
                disponivel: true,
            },
            {
                nome: 'Combo Família',
                descricao: '4 X-Burgers + 2 Batatas + 1 Refri 2L',
                categoria: 'COMBO',
                preco: 110.0,
                disponivel: true,
            },
        ],
    });
const todosClientes = await prisma.cliente.findMany();
const todosProdutos = await prisma.produto.findMany();
    // 4. CREATE MANY - PEDIDOS
    await prisma.pedido.createMany({
        data: [
            { clienteId: todosClientes[0].id, total: 43.9, status: 'PAGO' },
            { clienteId: todosClientes[1].id, total: 28.9, status: 'ABERTO' },
            { clienteId: todosClientes[2].id, total: 110.0, status: 'CANCELADO' },
        ],
    });
const todosPedidos = await prisma.pedido.findMany();
    // 5. CREATE MANY - ITENS DO PEDIDO
    await prisma.itemPedido.createMany({
        data: [
            // Itens do primeiro pedido
            {
                pedidoId: todosPedidos[0].id,
                produtoId: todosProdutos[0].id,
                quantidade: 1,
                precoUnitario: 28.9,
            },
            {
                pedidoId: todosPedidos[0].id,
                produtoId: todosProdutos[1].id,
                quantidade: 1,
                precoUnitario: 15.0,
            },
            // Itens do segundo pedido
            {
                pedidoId: todosPedidos[1].id,
                produtoId: todosProdutos[0].id,
                quantidade: 1,
                precoUnitario: 28.9,
            },
            // Itens do terceiro pedido
            {
                pedidoId: todosPedidos[2].id,
                produtoId: todosProdutos[6].id,
                quantidade: 1,
                precoUnitario: 110.0,
            },
        ],
    });

    console.log('✅ Seed concluído!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
