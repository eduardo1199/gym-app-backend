import { Request, Response } from 'express';

import { prisma } from '../../prismaClient';

export async function createdAdmin(request: Request, response: Response) {
  const dataAdmin = request.body;

  try {
    const getAdmin = await prisma.admin.findUnique({
      where: {
        cpf: dataAdmin.cpf,
      },
    });

    if(!!getAdmin?.cpf) return response.status(401).json({ message: 'Usuário administrador já existe' });

    const admin = await prisma.admin.create({
      data: {
        ...dataAdmin
      }
    });

    return response.status(201).json(admin);
  } catch (error) {
    return response.status(400).json({ error: error });
  }
}

export async function getAdmin(request: Request, response: Response) {
  const dataAdmin = request.body;

  try {
    const admin = await prisma.admin.findUnique({
      where: {
        cpf: dataAdmin.cpf,
      },
    });

    if(!admin?.id) return response.status(401).json({ message: 'Usuário administrador não existe' });

    if(admin.password !== dataAdmin.password) return response.status(401).json({ message: 'Senha incorreta!' });

    return response.status(200).json(admin);
  } catch (error) {
    return response.status(400).json({ error: error });
  }
}