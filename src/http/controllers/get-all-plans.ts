import { Request, Response } from 'express'
import { PrismaPlanRepository } from '../../repositories/plan-repository/prisma-plan-repository'
import { z } from 'zod'
import { GetAllPlansUseCase } from '../../use-cases/plan-use-cases/get-all-plans'

export default async function GetAllPlans(
  request: Request,
  response: Response,
) {
  try {
    const planRepository = new PrismaPlanRepository()

    const getPlanUseCase = new GetAllPlansUseCase(planRepository)

    const { plans } = await getPlanUseCase.execute()

    return response.status(200).json({
      plans,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorsZodResponse = error.issues.map((issue) => {
        return {
          message: issue.message,
          path: issue.path[0],
        }
      })

      return response.status(404).json(errorsZodResponse)
    } else {
      console.error(error)
      return response.status(500).send('Error interno do servido!')
    }
  }
}
