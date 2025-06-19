import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const listarGrupos = async (req: Request, res: Response) => {
  try {
    const grupos = await prisma.grupo.findMany({
      include: {
        exercicios: true,
      },
    });

    res.json(grupos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar grupos' });
  }
};
