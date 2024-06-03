import { Request, Response } from 'express'
import { UserEditSchema, registerUserSchema } from '../../schemas/user'
import { z } from 'zod'
import { EditUserUseCase } from '../../use-cases/users-cases/edit-user'
import { PrismaUserRepository } from '../../repositories/user-repository/prisma-user-repository'
import { PrismaPlanRepository } from '../../repositories/plan-repository/prisma-plan-repository'
import { ParamsIdRequestSchema } from '../../schemas/params-request-id'
import { StatusCodeErrors } from '../../err/status.code-errors'
import { NotFoundError } from '../../err/not-found-error'

export async function updateUser(request: Request, response: Response) {
  try {
    const { id } = ParamsIdRequestSchema.parse(request.params)

    const { age, cpf, name, planId, start_plan_date, weight } =
      UserEditSchema.parse(request.body)

    const userRepository = new PrismaUserRepository()
    const planRepository = new PrismaPlanRepository()

    const editUserUseCase = new EditUserUseCase(userRepository, planRepository)

    await editUserUseCase.execute(
      {
        age,
        cpf,
        name,
        planId,
        start_plan_date,
        weight,
      },
      id,
    )

    return response
      .status(StatusCodeErrors.UPDATE_SUCCESS)
      .send('Aluno atulizado com sucesso!')
  } catch (error) {
    if (error instanceof NotFoundError) {
      return response.status(409).json({
        message: error.message,
      })
    }

    throw error
  }
}
