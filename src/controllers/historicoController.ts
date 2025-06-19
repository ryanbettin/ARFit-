// src/controllers/historicoController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extensão de Request para incluir usuário autenticado via middleware
interface AuthRequest extends Request {
  user?: { id: number };
}

// POST /historico → registra conclusão de exercício e verifica metas
export const registrarHistorico = async (req: AuthRequest, res: Response) => {
  const usuarioId = req.user?.id;
  const { exercicioId, performedSeries, performedReps } = req.body as {
    exercicioId: number;
    performedSeries: number;
    performedReps: number;
  };

  if (!usuarioId || exercicioId == null || performedSeries == null || performedReps == null) {
    return res.status(400).json({ erro: 'Dados insuficientes para registrar histórico' });
  }

  try {
    // 1. Registrar no histórico com séries e repetições
    await prisma.historico.create({
      data: { usuarioId, exercicioId, performedSeries, performedReps }
    });

    // 2. Buscar metas pendentes que incluem este exercício
    const metas = await prisma.meta.findMany({
      where: { usuarioId, concluida: false },
      include: { exercicios: { include: { exercicio: true } } },
    });

    // 3. Atualizar metas que agora estão completas
    for (const meta of metas) {
      const idsMeta = meta.exercicios.map(me => me.exercicio.id);
      const historicoUsuario = await prisma.historico.findMany({
        where: { usuarioId, exercicioId: { in: idsMeta } },
        distinct: ['exercicioId'],
      });
      const idsConcluidos = historicoUsuario.map(h => h.exercicioId);

      if (idsMeta.every(id => idsConcluidos.includes(id))) {
        await prisma.meta.update({ where: { id: meta.id }, data: { concluida: true } });
      }
    }

    return res.status(201).json({ mensagem: 'Treino registrado no histórico!' });
  } catch (erro) {
    console.error('Erro ao registrar histórico:', erro);
    return res.status(500).json({ erro: 'Erro ao registrar treino' });
  }
};

// GET /historico → lista os exercícios concluídos com data, série/reps e grupo
export const listarHistorico = async (req: AuthRequest, res: Response) => {
  const usuarioId = req.user?.id;

  if (!usuarioId) {
    return res.status(400).json({ erro: 'Usuário não autenticado' });
  }

  try {
    const historico = await prisma.historico.findMany({
      where: { usuarioId },
      orderBy: { data: 'desc' },
      include: {
        exercicio: { include: { grupo: true } }
      }
    });

    return res.json(historico);
  } catch (erro) {
    console.error('Erro ao listar histórico:', erro);
    return res.status(500).json({ erro: 'Erro ao buscar histórico' });
  }
};
