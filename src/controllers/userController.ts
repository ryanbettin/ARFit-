// src/controllers/userController.ts
import { Request, Response } from 'express';
import { PrismaClient }      from '@prisma/client';

const prisma = new PrismaClient();

// Extensão de Request para incluir usuário autenticado pelo middleware
type AuthRequest = Request & { user?: { id: number } };

// GET /usuario → retorna nome e email do usuário autenticado
export const perfilUsuario = async (req: AuthRequest, res: Response) => {
  const usuarioId = req.user?.id;
  if (!usuarioId) {
    return res.status(401).json({ erro: 'Usuário não autenticado' });
  }
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { nome: true, email: true }
    });
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    return res.json(usuario);
  } catch (err) {
    console.error('Erro ao buscar perfil do usuário:', err);
    return res.status(500).json({ erro: 'Erro ao buscar perfil do usuário' });
  }
};