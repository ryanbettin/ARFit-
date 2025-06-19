import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obterResumoDashboard = async (req: Request, res: Response) => {
  const usuarioId = req.body.usuarioId;

  try {
    const totalMetas = await prisma.meta.count({ where: { usuarioId } });

    const metasConcluidas = await prisma.meta.count({
      where: { usuarioId, concluida: true },
    });

    const totalHistorico = await prisma.historico.count({
      where: { usuarioId },
    });

    const exerciciosUnicos = await prisma.historico.findMany({
      where: { usuarioId },
      distinct: ['exercicioId'],
      select: { exercicioId: true },
    });

    res.json({
      totalMetas,
      metasConcluidas,
      metasPendentes: totalMetas - metasConcluidas,
      totalTreinosFeitos: totalHistorico,
      exerciciosUnicosConcluidos: exerciciosUnicos.length,
    });
  } catch (erro) {
    console.error('Erro no dashboard:', erro);
    res.status(500).json({ erro: 'Erro ao gerar resumo do dashboard' });
  }
};
