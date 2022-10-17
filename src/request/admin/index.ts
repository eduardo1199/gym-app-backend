import { Request, Response } from 'express';

import { z } from 'zod';

import { prisma } from '../../prismaClient';
import { AdminSchema, AdminSchemaType} from '../../schema/admin';

export async function createdAdmin(request: Request, response: Response) {
  const dataAdmin: AdminSchemaType = request.body;

  try {
    const parsedAdmin = AdminSchema.parse(dataAdmin);

    const getAdmin = await prisma.admin.findUnique({
      where: {
        cpf: parsedAdmin.cpf,
      },
    });

    if(!!getAdmin?.cpf) return response.status(401).json({ message: 'Usuário administrador já existe' });

    const admin = await prisma.admin.create({
      data: {
        ...parsedAdmin
      }
    });

    return response.status(201).json(admin);
  } catch (error) {
    if(error instanceof z.ZodError) {
      const errorsZodResponse = error.issues.map((issue) => {
        return {
          message: issue.message,
          path: issue.path[0]
        }
      });

      return response.status(401).json(errorsZodResponse);
    }

    return response.status(400).json({ error: error });
  }
}

export async function getAuthenticationAdmin(request: Request, response: Response) {
  const dataAdmin = request.body;

  try {
    const admin = await prisma.admin.findUniqueOrThrow({
      where: {
        cpf: dataAdmin.cpf,
      },
      select: {
        id: true,
        password: true
      }
    });

    if(admin.password !== dataAdmin.password) return response.status(401).json({ message: 'Senha incorreta!' });

    return response.status(200).json({ id: admin.id });
  } catch (error) {
    return response.status(400).json({ message: 'Dados incorretos ou não existe usuário com os dados informados!' });
  }
}

export async function getAdmin(request: Request, response: Response) {
  const dataAdmin = request.params.id;

  try {
    const admin = await prisma.admin.findUniqueOrThrow({
      where: {
        cpf: dataAdmin,
      },
      select: {
        name: true,
        year: true,
      }
    });

    return response.status(200).json(admin);
  } catch (error) {
    return response.status(400).json({ message: 'Dados incorretos ou não existe usuário com os dados informados!' });
  }
}