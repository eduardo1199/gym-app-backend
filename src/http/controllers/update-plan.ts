import { Request, Response } from 'express'
import { z } from 'zod'
import { PrismaPlanRepository } from '../../repositories/plan-repository/prisma-plan-repository'
import { ParamsIdRequestSchema } from '../../schemas/params-request-id'
import { PlanEditSchema } from '../../schemas/plan'
import { UpdatePlanUseCase } from '../../use-cases/plan-use-cases/update-plan'
import { NotFoundError } from '../../err/not-found-error'
import { SameNameOrPeriodTimePlanError } from '../../err/same-name-or-time-plan-error'

export async function updatePlanController(
  request: Request,
  response: Response,
) {
  try {
    const { id } = ParamsIdRequestSchema.parse(request.params)

    const { price, plan_month_time, name } = PlanEditSchema.parse(request.body)

    const plansRepository = new PrismaPlanRepository()
    const updatePlanUseCase = new UpdatePlanUseCase(plansRepository)

    await updatePlanUseCase.execute({
      id,
      name: name ?? undefined,
      price: price ?? undefined,
      plan_month_time: plan_month_time ?? undefined,
    })

    return response.status(204).send('Plano atulizado com sucesso!')
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof SameNameOrPeriodTimePlanError
    ) {
      return response.status(409).json({
        message: error.message,
      })
    }

    throw error
  }
}
