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
    console.log('📦 Inserindo novos registros...');

    await prisma.cliente.createMany({
        data: [
            {
                id: 1,
                nome: 'Lucas Oliveira',
                telefone: '11988887777',
                email: 'lucas.oliveira@email.com',
                cpf: '123.456.789-01',
                cep: '01310100',
                logradouro: null,
                bairro: null,
                localidade: null,
                uf: null,
                ativo: true,
            },
            {
                id: 2,
                nome: 'Mariana Souza',
                telefone: '21977776666',
                email: 'mari.souza@provedor.net',
                cpf: '234.567.890-12',
                cep: '20040002',
                logradouro: null,
                bairro: null,
                localidade: null,
                uf: null,
                ativo: true,
            },
            {
                id: 3,
                nome: 'Ricardo Mendes',
                telefone: '31966665555',
                email: 'mendes.ricardo@empresa.com.br',
                cpf: '345.678.901-23',
                cep: '30140010',
                logradouro: null,
                bairro: null,
                localidade: null,
                uf: null,
                ativo: true,
            },
        ],
    });

    await prisma.produto.createMany({
        data: [
            {
                id: 1,
                nome: 'X-Burguer',
                descricao: 'Delicioso lanche com carne, queijo e molho especial',
                categoria: 'LANCHE',
                preco: 15.99,
                disponivel: true,
            },
            {
                id: 2,
                nome: 'Coca-Cola',
                descricao: 'Refrigerante de cola 350ml',
                categoria: 'BEBIDA',
                preco: 4.5,
                disponivel: true,
            },
            {
                id: 3,
                nome: 'Pudim de Leite',
                descricao: 'Sobremesa cremosa de leite condensado',
                categoria: 'SOBREMESA',
                preco: 8.0,
                disponivel: true,
            },
        ],
    });
    await prisma.pedido.createMany({
        data: [
            {
                id: 1,
                clienteId: 1,
                total: 20.99,
                status: 'ABERTO',
                criadoEm: new Date(),
            },
            {
                id: 2,
                clienteId: 2,
                total: 23.5,
                status: 'PAGO',
                criadoEm: new Date(),
            },
            {
                id: 3,
                clienteId: 3,
                total: 12.0,
                status: 'CANCELADO',
                criadoEm: new Date(),
            },
        ],
    });
    await prisma.itemPedido.createMany({
        data: [
            {
                id: 1,
                pedidoId: 1,
                produtoId: 1,
                quantidade: 1,
                precoUnitario: 15.99,
            },
            {
                id: 2,
                pedidoId: 2,
                produtoId: 2,
                quantidade: 2,
                precoUnitario: 4.5,
            },
            {
                id: 3,
                pedidoId: 3,
                produtoId: 3,
                quantidade: 1,
                precoUnitario: 8.0,
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
