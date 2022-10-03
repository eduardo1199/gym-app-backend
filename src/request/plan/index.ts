import { Request, Response } from 'express';

import { prisma } from '../../prismaClient';

export  async function createdPlan(request: Request, response: Response) {
  const planData = request.body;

  try {
    const plans = await prisma.plan.findMany();

    const planExists = 
      plans.some((plan) => (plan.name === planData.name || plan.timeOfPlan === planData.timeOfPlan));
  
    if(planExists) return response.status(400).json({ message: 'Já existe um plano com esse nome ou duração no sistema'});
  
    const plan = await prisma.plan.create({
      data: planData
    });

    return response.status(201).json(plan);
  } catch (err) {
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