import { Request, Response } from 'express'

import { z } from 'zod'

import { prisma } from '../../prismaClient'
import { PlanSchema } from '../../schemas/plan'

export async function createdPlan(request: Request, response: Response) {
  const parsedPlan = PlanSchema.parse(request.body)

  try {
    const plans = await prisma.plan.findMany()

    const planExists = plans.some(
      (plan) =>
        plan.name === parsedPlan.name ||
        plan.timeOfPlan === parsedPlan.timeOfPlan,
    )

    if (planExists)
      return response.status(400).json({
        message: 'Já existe um plano com esse nome ou duração no sistema',
      })

    await prisma.plan.create({
      data: parsedPlan,
    })

    return response.status(201).json('Plano criado com sucesso!')
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorsZodResponse = error.issues.map((issue) => {
        return {
          message: issue.message,
          path: issue.path[0],
        }
      })

      return response.status(400).json(errorsZodResponse)
    }

    response.status(500).json({ message: 'Erro ao criar um novo plano!' })
  }
}

export async function getPlan(request: Request, response: Response) {
  const planId = request.params.id

  try {
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      select: {
        name: true,
        price: true,
        timeOfPlan: true,
        id: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
    })

    if (!plan)
      return response.status(404).json({ message: 'Plano não existe!' })

    return response.status(200).json(plan)
  } catch (err) {
    return response.status(500).json({
      message: 'Erro ao buscar o plano!',
    })
  }
}

export async function getPlans(request: Request, response: Response) {
  const plans = await prisma.plan.findMany()

  return response.status(200).json(plans)
}

export async function deletePlan(request: Request, response: Response) {
  const idPlan = request.params.id

  try {
    await prisma.user.updateMany({
      where: {
        planId: idPlan,
      },
      data: {
        endDateforPlan: new Date(),
      },
    })

    const plan = await prisma.plan.delete({
      where: {
        id: idPlan,
      },
    })

    return response.status(200).json({ name: plan.name })
  } catch (err) {
    return response
      .status(401)
      .json({ message: 'Existem usuários com esse plano cadastrado!' })
  }
}

export async function updatePlan(request: Request, response: Response) {
  const planId = request.params.id
  const newPlanData = request.body

  try {
    const newPlan = await prisma.plan.update({
      where: {
        id: planId,
      },
      data: newPlanData,
    })

    return response.status(201).json(newPlan)
  } catch (err) {
    return response.status(500).json({ message: 'Erro ao atualizar plano!' })
  }
}
