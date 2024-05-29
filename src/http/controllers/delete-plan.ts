import { z } from 'zod'
import { PrismaPlanRepository } from '../../repositories/plan-repository/prisma-plan-repository'
import { ParamsIdRequestSchema } from '../../schemas/params-request-id'
import { DeletePlanUseCase } from '../../use-cases/plan-use-cases/delete-plan'
import { Request, Response } from 'express'
import { NotFoundError } from '../../err/not-found-error'

export async function deletePlanController(
  request: Request,
  response: Response,
) {
  try {
    const { id } = ParamsIdRequestSchema.parse(request.params)

    const plansRepository = new PrismaPlanRepository()
    const removeUserUseCase = new DeletePlanUseCase(plansRepository)

    await removeUserUseCase.execute({
      id,
    })

    return response.status(204).send('Plano removido com sucesso!')
  } catch (error) {
    if (error instanceof NotFoundError) {
      return response.status(409).json({
        message: error.message,
      })
    }

    throw error
  }
}
