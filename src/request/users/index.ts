import { Request, Response } from 'express';
import { add, compareAsc, formatDistance  } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { prisma } from '../../prismaClient';

export async function createdUser(request: Request, response: Response) {
  const userBody = request.body;

  try {
    const getUserExist = await prisma.user.findUnique({
      where: {
        cpf: userBody.cpf
      }
    });

    if(getUserExist?.cpf) return response.status(401).json({ message: 'Usuário já existe.' });

    const plan = await prisma.plan.findUnique({
      where: {
        id: userBody.planId,
      }
    });

    const userData = {
      ...userBody,
      startDateForPlan: new Date(),
      endDateforPlan: add(new Date(), {
        days: plan?.timeOfPlan 
      }),
    }
    
     const user = await prisma.user.create({
      data: userData,
    });

    return response.status(201).json(user);
  } catch (err) {
    console.log(err);

    return response.status(500).json({ message: 'Erro ao cadastrar usuário!' })
  }
}

export async function getAllUsers(request: Request, response: Response) {
  try {
    const users = await prisma.user.findMany();

    const serializeUsers = users.map((user) => {
      const isActive = compareAsc(user.endDateforPlan, new Date());
  
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
    const user = await prisma.user.findFirstOrThrow({
      where: {
        cpf: userId,
      },
    });

    const isActive = compareAsc(user?.endDateforPlan!, new Date());

    const serializeUser = {
      ...user,
      isActive: isActive === -1 ? false : true,
      timeFinishPlan: formatDistance(new Date(), user.endDateforPlan, {
        locale: ptBR,   
      }),
    };
  
    return response.status(200).json(serializeUser);
  } catch (err) {
    return response.status(500).json({ message: 'Erro ao buscar usuário!' });
  }
}

export async function deleteUser(request: Request, response: Response) {
  const userId = request.params.id;

  try {
    const user = await prisma.user.delete({
      where: {
        cpf: userId
      }
    });

    return response.status(200).json(user);
  } catch (err) {
    return response.status(500).json({ message: 'Erro ao excluir usuário!' });
  }
}

export async function updateUser(request: Request, response: Response) {
  const userBody = request.body;
  const userId = request.params.id;

  try {
    const plan = await prisma.plan.findUniqueOrThrow({
      where: {
        id: userBody.planId
      }
    });
    
    const user = await prisma.user.update({
      where: {
        cpf: userId,
      },
      data: {
        age: userBody.age,
        cpf: userBody.cpf,
        name: userBody.name,
        planId: userBody.planId,
        startDateForPlan: userBody.startDateForPlan,
        weight: userBody.weight,
        endDateforPlan: add(new Date(userBody.startDateForPlan), {
          days: plan.timeOfPlan
        }),
      },
    });

    return response.status(201).json(user);
  } catch (err) {
    console.log(err);

    return response.status(500).json({ message: 'Erro ao atualizar usuário!' })
  }
}