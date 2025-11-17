import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// Extensão de Request para incluir usuário autenticado
interface AuthRequest extends Request {
  user?: { id: number };
}

export const autenticar = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  const [, token] = authHeader.split(' ');
  if (!token) {
    return res.status(401).json({ erro: 'Token inválido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    // Anexa o ID do usuário ao request para uso posterior
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
};
