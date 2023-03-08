import { Request, Response } from 'express';
import { add, compareAsc, formatDistance  } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { z } from 'zod';

import { prisma } from '../../prismaClient';
import { UserSchema } from '../../schemas/user';

export async function createdUser(request: Request, response: Response) {
  try {
    const userBody = UserSchema.parse(request.body);

    const getUserExist = await prisma.user.findUnique({
      where: {
        cpf: userBody.cpf
      }
    });

    if(getUserExist?.cpf) return response.status(401).json({ message: 'Usuário já existe.' });

    const plan = await prisma.plan.findFirstOrThrow({
      where: {
        id: userBody.planId,
      }
    });

    const initialDateFromPlan = userBody?.startDateForPlan ? new Date(userBody.startDateForPlan) : new Date()
    const parseEndDateOfPlan =  add(initialDateFromPlan, {
      days: plan.timeOfPlan
    })

    const userData = {
      ...userBody,
      startDateForPlan: initialDateFromPlan,
      endDateforPlan: parseEndDateOfPlan
    }

    const { age, cpf, endDateforPlan , name, planId, startDateForPlan, weight } = userData

    const user = await prisma.user.create({
      data: {
        age,
        cpf,
        endDateforPlan,
        name,
        planId,
        startDateForPlan,
        weight
      },
    });

    return response.status(201).json({ id: user.id });
  } catch (error) {
    if(error instanceof z.ZodError) {
      const errorsZodResponse = error.issues.map((issue) => {
        return {
          message: issue.message,
          path: issue.path[0]
        }
      });

      return response.status(401).json(errorsZodResponse);
    } else {    
      return response.status(500).json({ message: 'Erro ao cadastrar usuário!' })
    }
  }
}

export async function getAllUsers(request: Request, response: Response) {
  try {
    const users = await prisma.user.findMany();

    const serializeUsers = users.map((user) => {
      const isActive = compareAsc(user.endDateforPlan, user.startDateForPlan);
  
      return {
        ...user,
        isActive: isActive === -1 ? false : true,
      }
    });
  
    return response.status(200).json(serializeUsers);
  } catch (err) {
    return response.status(500).json({ message: 'Erro ao buscar usuários!' })
  }
}

export async function getUser(request: Request, response: Response) {
  const userId = request.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
    });

    if(!user?.id) return response.status(404).json({ message: 'Usuário não existe!'});

    const isActive = compareAsc(user.endDateforPlan, user.startDateForPlan);

    const serializeUser = {
      ...user,
      isActive: isActive === -1 ? false : true,
      timeFinishPlan: formatDistance(user.startDateForPlan, user.endDateforPlan, {
        locale: ptBR,   
      }),
    };
  
    return response.status(200).json(serializeUser);
  } catch (err) {
    return response.status(500).json({ message: 'Erro ao buscar usuário!' });
  }
}

export async function authenticationUser(request: Request, response: Response) {
  const { cpf } = request.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        cpf,
      },
    });

    if(!user) response.status(400).json({ message: 'Não foi encontrado usuário com essa informação!' });
    
    return response.status(200).json({ id: user?.id })
  } catch (err) {
    return response.status(500).json({ message: 'Erro de autenticação!' });
  }
}

export async function deleteUser(request: Request, response: Response) {
  const userId = request.params.id;

  try {
    await prisma.user.delete({
      where: {
        id: userId
      }
    });

    return response.status(200).json({ message: 'Usuário excluido com sucesso!' });
  } catch (err) {
    return response.status(500).json({ message: 'Erro ao excluir usuário!' });
  }
}

export async function updateUser(request: Request, response: Response) {
  const userData = UserSchema.parse(request.body)
  const userId = request.params.id;

  try {
    const plan = await prisma.plan.findFirst({
      where: {
        id: userData.planId
      }
    });

    const addTimeForPlan = add(new Date(userData.startDateForPlan!), { days: plan?.timeOfPlan ?? 0 })
    
    const user = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        ...userData,
        endDateforPlan: addTimeForPlan,
      },
    });

    return response.status(201).json({ message: 'Aluno atualizado com sucesso!' });
  } catch (err) {
    return response.status(500).json({ message: 'Erro ao atualizar usuário!' })
  }
}