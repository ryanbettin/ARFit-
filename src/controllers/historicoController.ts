import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extensão de Request para incluir usuário autenticado via middleware
interface AuthRequest extends Request {
  user?: { id: number };
}

// Função para calcular XP necessário por nível
const calcularXpParaNivel = (nivel: number): number => {
  // A cada nível, aumenta 25 XP o requisito
  return 100 + (nivel - 1) * 25;
};

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
    // 1️⃣ Registrar o exercício no histórico
    await prisma.historico.create({
      data: { usuarioId, exercicioId, performedSeries, performedReps },
    });

    // 2️⃣ Buscar usuário atual
    const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    // XP base ganho ao concluir o exercício
    let xpGanho = 25;
    let xpAcumulado = usuario.xp + xpGanho;
    let novoNivel = usuario.nivel;

    // 3️⃣ Buscar metas pendentes e verificar se alguma foi concluída
    const metas = await prisma.meta.findMany({
      where: { usuarioId, concluida: false },
      include: {
        exercicios: { include: { exercicio: true } },
      },
    });

    for (const meta of metas) {
      const idsMeta = meta.exercicios.map((me) => me.exercicio.id);

      const historicoUsuario = await prisma.historico.findMany({
        where: { usuarioId, exercicioId: { in: idsMeta } },
        distinct: ['exercicioId'],
      });

      const idsConcluidos = historicoUsuario.map((h) => h.exercicioId);
      const todosConcluidos = idsMeta.every((id) => idsConcluidos.includes(id));

      if (todosConcluidos) {
        await prisma.meta.update({
          where: { id: meta.id },
          data: { concluida: true },
        });

        // +75 XP por meta concluída
        xpGanho += 75;
        xpAcumulado += 75;
      }
    }

    // 4️⃣ Calcular novo nível de forma segura (sem resetar)
    let xpTemp = xpAcumulado;
    let nivelTemp = novoNivel;
    let xpParaProximo = calcularXpParaNivel(nivelTemp);

    while (xpTemp >= xpParaProximo) {
      xpTemp -= xpParaProximo;
      nivelTemp += 1;
      xpParaProximo = calcularXpParaNivel(nivelTemp);
    }

    // 5️⃣ Atualizar usuário com o XP restante e novo nível
    await prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        xp: xpTemp,
        nivel: nivelTemp,
      },
    });

    // 6️⃣ Retornar resposta detalhada
    return res.status(201).json({
      mensagem: 'Treino registrado no histórico!',
      xpGanho,
      xpAtualNoNivel: xpTemp,
      nivelAtual: nivelTemp,
      proximoNivelEm: xpParaProximo,
    });

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
        exercicio: { include: { grupo: true } },
      },
    });

    return res.json(historico);
  } catch (erro) {
    console.error('Erro ao listar histórico:', erro);
    return res.status(500).json({ erro: 'Erro ao buscar histórico' });
  }
};
