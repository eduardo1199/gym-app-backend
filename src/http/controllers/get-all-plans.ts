import { Request, Response } from 'express'
import { PrismaPlanRepository } from '../../repositories/plan-repository/prisma-plan-repository'
import { z } from 'zod'
import { GetAllPlansUseCase } from '../../use-cases/plan-use-cases/get-all-plans'

export default async function GetAllPlans(
  request: Request,
  response: Response,
) {
  const planRepository = new PrismaPlanRepository()

  const getPlanUseCase = new GetAllPlansUseCase(planRepository)

  const { plans } = await getPlanUseCase.execute()

  return response.status(200).json({
    plans,
  })
}
