import { Request, Response } from 'express'
import { PrismaUserRepository } from '../../repositories/user-repository/prisma-user-repository'
import { RemoveUserUseCase } from '../../use-cases/users-cases/remove-user'
import { z } from 'zod'
import { ParamsIdRequestSchema } from '../../schemas/params-request-id'
import { StatusCodeErrors } from '../../err/status.code-errors'
import { NotFoundError } from '../../err/not-found-error'

export async function deleteUser(
  request: Request,
  response: Response,
  next: any,
) {
  try {
    const { id } = ParamsIdRequestSchema.parse(request.params)

    const userRepository = new PrismaUserRepository()
    const removeUserUseCase = new RemoveUserUseCase(userRepository)

    await removeUserUseCase.execute(id)

    return response
      .status(StatusCodeErrors.ACCEPTED)
      .send('Usuário removido com sucesso!')
  } catch (error) {
    if (error instanceof NotFoundError) {
      return response.status(409).json({
        message: error.message,
      })
    }

    next(error)
  }
}
