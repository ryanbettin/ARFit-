import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const cadastrarUsuario = async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;

  try {
    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'E-mail já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
      },
    });

    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (erro) {
  console.error('Erro ao cadastrar usuário →', erro); // 👈 ESSENCIAL
  return res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
}
};

export const loginUsuario = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    });

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (erro) {
    return res.status(500).json({ erro: 'Erro ao realizar login' });
  }
};
