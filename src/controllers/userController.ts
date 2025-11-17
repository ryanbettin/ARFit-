import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: { id: number };
}

export const perfilUsuario = async (req: AuthRequest, res: Response) => {
  const usuarioId = req.user?.id;

  if (!usuarioId) {
    return res.status(400).json({ erro: 'Usuário não autenticado' });
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        nome: true,
        email: true,
        xp: true,
        nivel: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    return res.json(usuario);
  } catch (erro) {
    console.error('Erro ao buscar perfil:', erro);
    return res.status(500).json({ erro: 'Erro ao buscar perfil' });
  }
};
