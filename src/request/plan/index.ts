import { Request, Response } from 'express';

import { z } from 'zod';

import { prisma } from '../../prismaClient';
import { PlanSchema, PlanSchemaType } from '../../schema/plan';

export  async function createdPlan(request: Request, response: Response) {
  const planData: PlanSchemaType = request.body;

  try {
    const parsedPlan = PlanSchema.parse(planData);

    const plans = await prisma.plan.findMany();

    const planExists = 
      plans.some((plan) => (plan.name === parsedPlan.name || plan.timeOfPlan === parsedPlan.timeOfPlan));
  
    if(planExists) return response.status(400).json({ message: 'Já existe um plano com esse nome ou duração no sistema'});
  
    const plan = await prisma.plan.create({
      data: parsedPlan
    });

    return response.status(201).json(plan);
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

    response.status(400).json({ message: 'Erro ao criar um novo plano!'});
  }
};

export async function getPlan(request: Request, response: Response) {
  const planId = request.params.id;

  try {
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if(!plan) return response.status(400).json({ message: 'Plano não existe!' });
  
    return response.status(200).json(plan);
  } catch (err) {
    return response.status(500).json({
      message: 'Erro ao buscar o plano!'
    });
  }
}

export async function getPlans(request: Request, response: Response) {
  const plans = await prisma.plan.findMany();

  return response.status(200).json(plans);
}

export async function deletePlan(request: Request, response: Response) {
  const idPlan = request.params.id;

  try {
    const plan = await prisma.plan.delete({
      where: {
        id: idPlan
      }
    });
  
    return response.status(200).json(plan);
  } catch (err) {
    return response.status(500).json({ message: 'Erro ao excluir plano!' });
  }
}

export async function updatePlan(request: Request, response: Response) {
  const planId = request.params.id;
  const newPlanData = request.body;

  try {
    const newPlan = await prisma.plan.update({
      where: {
        id: planId,
      },
      data: {
        name: newPlanData.name,
        price: newPlanData.price,
        timeOfPlan: newPlanData.timeOfPlan
      }
    });

    return response.status(201).json(newPlan);
  } catch (err) {
    return response.status(500).json({ message: 'Erro ao atualizar plano!' });
  }
}

export async function getQuantityUsersWithPlan(request: Request, response: Response) {
  const planId = request.params.id;

  try {
    const total = await prisma.plan.findUnique({
      where: {
        id: planId,
      },
      include: {
      _count: {
        select: {
          users: true
        }
      }
     },
    });

    return response.status(201).json(total?._count ?? 0);
  } catch (err) {
    return response.status(500).json({ message: 'Erro ao buscar quantidade de usuários em uma plano!' });
  }
}