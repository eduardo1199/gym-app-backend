import { Request, Response } from 'express'
import { PlanSchema } from '../../schemas/plan'
import { PrismaPlanRepository } from '../../repositories/plan-repository/prisma-plan-repository'
import { CreatePlanUseCase } from '../../use-cases/plan-use-cases/create-plan'
import { z } from 'zod'

export default async function RegisterPlan(
  request: Request,
  response: Response,
) {
  try {
    const { name, price, timeOfPlan } = PlanSchema.parse(request.body)

    const planRepository = new PrismaPlanRepository()

    const registerPlanUseCase = new CreatePlanUseCase(planRepository)

    await registerPlanUseCase.execute({
      name,
      price,
      timeOfPlan,
    })

    return response.status(201).send('Plano cadastrado com sucesso!')
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
      /*  console.log(error) */

      return response.status(500).json()
    }
  }
}
