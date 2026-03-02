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

    // Remove todos os registros
    // await prisma.exemplo.deleteMany();

    console.log('📦 Inserindo novos registros...');

    await prisma.exemplo.createMany({
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
