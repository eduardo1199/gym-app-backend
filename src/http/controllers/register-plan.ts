import { Request, Response } from 'express'
import { PlanSchema } from '../../schemas/plan'
import { PrismaPlanRepository } from '../../repositories/plan-repository/prisma-plan-repository'
import { CreatePlanUseCase } from '../../use-cases/plan-use-cases/create-plan'
import { z } from 'zod'
import { SameNameOrPeriodTimePlanError } from '../../err/same-name-or-time-plan-error'

export default async function RegisterPlan(
  request: Request,
  response: Response,
) {
  try {
    const { name, price, plan_month_time } = PlanSchema.parse(request.body)

    const planRepository = new PrismaPlanRepository()

    const registerPlanUseCase = new CreatePlanUseCase(planRepository)

    await registerPlanUseCase.execute({
      name,
      price,
      plan_month_time,
    })

    return response.status(201).send('Plano cadastrado com sucesso!')
  } catch (error) {
    if (error instanceof SameNameOrPeriodTimePlanError) {
      return response.status(409).json({
        message: error.message,
      })
    }

    throw error
  }
}
