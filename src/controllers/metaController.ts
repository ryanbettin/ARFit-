// src/controllers/metaController.ts
import { Request, Response } from 'express';
import { PrismaClient }      from '@prisma/client';

const prisma = new PrismaClient();

// Extensão de Request para incluir usuário autenticado pelo middleware
type AuthRequest = Request & { user?: { id: number } };

// GET /metas → lista todas as metas do usuário, incluindo targetSeries, targetReps e targetPeso, além dos dados do exercício
export const listarMetas = async (req: AuthRequest, res: Response) => {
  const usuarioId = req.user?.id;
  if (!usuarioId) {
    return res.status(401).json({ erro: 'Usuário não autenticado' });
  }

  try {
    const metas = await prisma.meta.findMany({
      where: { usuarioId },
      include: {
        exercicios: {
          include: {
            exercicio: true  // retorna também os dados completos de cada exercício
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(metas);
  } catch (err) {
    console.error('Erro ao buscar metas:', err);
    return res.status(500).json({ erro: 'Erro ao buscar metas' });
  }
};

// POST /metas → cria nova meta com séries, repetições e peso alvo por exercício
export const criarMeta = async (req: AuthRequest, res: Response) => {
  const usuarioId = req.user?.id;
  if (!usuarioId) {
    return res.status(401).json({ erro: 'Usuário não autenticado' });
  }

  // corpo deve vir com nome e lista de { id, targetSeries, targetReps, targetPeso }
  const { nome, exercicios } = req.body as {
    nome: string;
    exercicios: Array<{
      id: number;
      targetSeries: number;
      targetReps: number;
      targetPeso: number;
    }>;
  };

  if (
    !nome ||
    !Array.isArray(exercicios) ||
    exercicios.length === 0 ||
    exercicios.some(e =>
      typeof e.id !== 'number' ||
      typeof e.targetSeries !== 'number' ||
      typeof e.targetReps !== 'number' ||
      typeof e.targetPeso !== 'number'
    )
  ) {
    return res.status(400).json({
      erro: 'Nome e lista de exercícios (com id, séries, repetições e peso) são obrigatórios'
    });
  }

  try {
    const meta = await prisma.meta.create({
      data: {
        nome,
        usuario: { connect: { id: usuarioId } },
        exercicios: {
          create: exercicios.map(e => ({
            exercicio:    { connect: { id: e.id } },
            targetSeries: e.targetSeries,
            targetReps:   e.targetReps,
            targetPeso:   e.targetPeso
          }))
        }
      },
      include: {
        exercicios: {
          include: { exercicio: true }
        }
      }
    });

    return res.status(201).json(meta);
  } catch (err) {
    console.error('Erro ao criar meta:', err);
    return res.status(500).json({ erro: 'Erro ao criar meta' });
  }
};
