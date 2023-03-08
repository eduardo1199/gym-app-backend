import { Request, Response } from 'express';

import { z } from 'zod';

import { prisma } from '../../prismaClient';
import { AdminAuthenticationSchema, AdminIdSchema, AdminSchema} from '../../schemas/admin';

export async function createdAdmin(request: Request, response: Response) {
  try {
    const parsedAdmin = AdminSchema.parse(request.body);

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

    return response.status(201).json({ id: admin.id });
  } catch (error) {
    if(error instanceof z.ZodError) {
      const errorsZodResponse = error.issues.map((issue) => {
        return {
          message: issue.message,
          path: issue.path[0]
        }
      });

      return response.status(400).json(errorsZodResponse);
    }

    return response.status(500).json({ error: error });
  }
}

export async function getAuthenticationAdmin(request: Request, response: Response) {
  try {
    const { cpf, password } = AdminAuthenticationSchema.parse(request.body);

    const admin = await prisma.admin.findUniqueOrThrow({
      where: {
        cpf
      },
      select: {
        id: true,
        password: true
      }
    });

    if(admin.password !== password) return response.status(401).json({ message: 'Senha incorreta!' });

    return response.status(200).json({ id: admin.id });
  }  catch (error) {
    if(error instanceof z.ZodError) {
      const errorsZodResponse = error.issues.map((issue) => {
        return {
          message: issue.message,
          path: issue.path[0]
        }
      });

      return response.status(400).json(errorsZodResponse);
    }

    return response.status(500).json({ error: error });
  }
}

export async function getAdmin(request: Request, response: Response) {
  try {
    const { id } = AdminIdSchema.parse(request.params);

    const admin = await prisma.admin.findUniqueOrThrow({
      where: {
        id
      },
      select: {
        name: true,
        year: true,
      }
    });

    return response.status(200).json(admin);
  } catch (error) {
    if(error instanceof z.ZodError) {
      const errorsZodResponse = error.issues.map((issue) => {
        return {
          message: issue.message,
          path: issue.path[0]
        }
      });

      return response.status(400).json(errorsZodResponse);
    }

    return response.status(500).json({ error: error });
  }
}