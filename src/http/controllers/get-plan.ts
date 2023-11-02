import { Request, Response } from 'express'
import { PrismaPlanRepository } from '../../repositories/plan-repository/prisma-plan-repository'
import { z } from 'zod'
import { ParamsIdRequestSchema } from '../../schemas/params-request-id'
import { GetPlanUseCase } from '../../use-cases/plan-use-cases/get-plan'

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
