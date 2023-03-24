import { Request, Response } from 'express'

import { z } from 'zod'

import { prisma } from '../../prismaClient'
import { PlanSchema, ParamsIdSchema, PlanEditSchema } from '../../schemas/plan'
import { StatusCodeErrors } from '../../err/status.code-errors'

export async function createdPlan(request: Request, response: Response) {
  try {
    const parsedPlan = PlanSchema.parse(request.body)

    const plans = await prisma.plan.findMany()

    const planExists = plans.some(
      (plan) =>
        plan.name === parsedPlan.name ||
        plan.timeOfPlan === parsedPlan.timeOfPlan,
    )

    if (planExists)
      return response.status(StatusCodeErrors.BAD_REQUEST).json({
        message: 'Já existe um plano com esse nome ou duração no sistema',
      })

    await prisma.plan.create({
      data: parsedPlan,
    })

    return response
      .status(StatusCodeErrors.CREATED)
      .json('Plano criado com sucesso!')
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorsZodResponse = error.issues.map((issue) => {
        return {
          message: issue.message,
          path: issue.path[0],
        }
      })

      return response
        .status(StatusCodeErrors.BAD_REQUEST)
        .json(errorsZodResponse)
    }

    response.status(StatusCodeErrors.INTERNAL_SERVER_ERROR).json(error)
  }
}

export async function getPlan(request: Request, response: Response) {
  try {
    const { id } = ParamsIdSchema.parse(request.params)

    const plan = await prisma.plan.findUnique({
      where: { id },
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
      return response
        .status(StatusCodeErrors.NOT_FOUND)
        .json({ message: 'Plano não existe!' })

    return response.status(StatusCodeErrors.SUCCESS).json(plan)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorsZodResponse = error.issues.map((issue) => {
        return {
          message: issue.message,
          path: issue.path[0],
        }
      })

      return response
        .status(StatusCodeErrors.BAD_REQUEST)
        .json(errorsZodResponse)
    } else {
      return response.status(StatusCodeErrors.INTERNAL_SERVER_ERROR).json(error)
    }
  }
}

export async function getPlans(request: Request, response: Response) {
  const plans = await prisma.plan.findMany()

  return response.status(StatusCodeErrors.SUCCESS).json(plans)
}

export async function deletePlan(request: Request, response: Response) {
  try {
    const { id } = ParamsIdSchema.parse(request.params)

    await prisma.user.updateMany({
      where: {
        id,
      },
      data: {
        endDateforPlan: new Date(),
      },
    })

    const plan = await prisma.plan.delete({
      where: {
        id,
      },
    })

    return response.status(StatusCodeErrors.SUCCESS).json({ name: plan.name })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorsZodResponse = error.issues.map((issue) => {
        return {
          message: issue.message,
          path: issue.path[0],
        }
      })

      return response
        .status(StatusCodeErrors.BAD_REQUEST)
        .json(errorsZodResponse)
    } else {
      return response
        .status(StatusCodeErrors.INTERNAL_SERVER_ERROR)
        .json({ error })
    }
  }
}

export async function updatePlan(request: Request, response: Response) {
  try {
    const { name, price, timeOfPlan } = PlanEditSchema.parse(request.body)
    const { id } = ParamsIdSchema.parse(request.params)

    const newPlan = await prisma.plan.update({
      where: {
        id,
      },
      data: {
        name,
        price,
        timeOfPlan,
      },
    })

    return response.status(StatusCodeErrors.CREATED).json(newPlan)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorsZodResponse = error.issues.map((issue) => {
        return {
          message: issue.message,
          path: issue.path[0],
        }
      })

      return response
        .status(StatusCodeErrors.BAD_REQUEST)
        .json(errorsZodResponse)
    } else {
      return response.status(StatusCodeErrors.INTERNAL_SERVER_ERROR).json(error)
    }
  }
}
