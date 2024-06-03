import { Request, Response } from 'express'
import { PrismaPlanRepository } from '../../repositories/plan-repository/prisma-plan-repository'
import { z } from 'zod'
import { ParamsIdRequestSchema } from '../../schemas/params-request-id'
import { GetPlanUseCase } from '../../use-cases/plan-use-cases/get-plan'
import { NotFoundError } from '../../err/not-found-error'

export default async function GetPlan(request: Request, response: Response) {
  try {
    const { id } = ParamsIdRequestSchema.parse(request.params)

    const planRepository = new PrismaPlanRepository()

    const getPlanUseCase = new GetPlanUseCase(planRepository)

    const { plan } = await getPlanUseCase.execute({
      id,
    })

    return response.status(200).json({
      plan,
    })
  } catch (error) {
    if (error instanceof NotFoundError) {
      return response.status(409).json({
        message: error.message,
      })
    }

    throw error
  }
}
