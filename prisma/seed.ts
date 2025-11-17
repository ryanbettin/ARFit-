import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const gruposComExercicios = [
  {
    id: 1,
    nome: 'Perna',
    exercicios: [
      { id: 1, nome: 'Agachamento' },
      { id: 2, nome: 'Leg Press' },
      { id: 3, nome: 'Cadeira Extensora' },
    ],
  },
  {
    id: 2,
    nome: 'Costas',
    exercicios: [
      { id: 4, nome: 'Remada Curvada' },
      { id: 5, nome: 'Puxada Alta' },
      { id: 6, nome: 'Levantamento Terra' },
    ],
  },
  {
    id: 3,
    nome: 'Peito',
    exercicios: [
      { id: 7, nome: 'Supino Reto' },
      { id: 8, nome: 'Crucifixo' },
      { id: 9, nome: 'Flexão de Braço' },
    ],
  },
  {
    id: 4,
    nome: 'Bíceps',
    exercicios: [
      { id: 10, nome: 'Rosca Direta' },
      { id: 11, nome: 'Rosca Martelo' },
      { id: 12, nome: 'Rosca Concentrada' },
    ],
  },
  {
    id: 5,
    nome: 'Tríceps',
    exercicios: [
      { id: 13, nome: 'Tríceps Testa' },
      { id: 14, nome: 'Tríceps Corda' },
      { id: 15, nome: 'Mergulho' },
    ],
  },
  {
    id: 6,
    nome: 'Ombro',
    exercicios: [
      { id: 16, nome: 'Desenvolvimento Militar' },
      { id: 17, nome: 'Elevação Lateral' },
      { id: 18, nome: 'Remada Alta' },
    ],
  },
  {
    id: 7,
    nome: 'Abdômen',
    exercicios: [
      { id: 19, nome: 'Abdominal Supra' },
      { id: 20, nome: 'Prancha' },
      { id: 21, nome: 'Elevação de Pernas' },
    ],
  },
];

async function main() {
  for (const grupoData of gruposComExercicios) {
    // Deleta se já existe (evita duplicar no re-seed)
    await prisma.exercicio.deleteMany({ where: { grupoId: grupoData.id } });
    await prisma.grupo.delete({ where: { id: grupoData.id } }).catch(() => {});

    const grupo = await prisma.grupo.create({
      data: {
        id: grupoData.id,
        nome: grupoData.nome,
      },
    });

    
    for (const exercicio of grupoData.exercicios) {
      await prisma.exercicio.create({
        data: {
          id: exercicio.id,
          nome: exercicio.nome,
          grupoId: grupo.id,
        },
      });
    }
  }

  console.log('Grupos e exercícios inseridos com os IDs fixos!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
