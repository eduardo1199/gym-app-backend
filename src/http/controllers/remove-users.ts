import { Request, Response } from 'express'
import { PrismaUserRepository } from '../../repositories/user-repository/prisma-user-repository'
import { RemoveUserUseCase } from '../../use-cases/users-cases/remove-user'
import { z } from 'zod'
import { ParamsIdRequestSchema } from '../../schemas/params-request-id'
import { StatusCodeErrors } from '../../err/status.code-errors'

export async function getUser(request: Request, response: Response) {
  try {
    const { id } = ParamsIdRequestSchema.parse(request.params)

    const userRepository = new PrismaUserRepository()
    const removeUserUseCase = new RemoveUserUseCase(userRepository)

    await removeUserUseCase.execute(id)

    return response
      .status(StatusCodeErrors.ACCEPTED)
      .send('Usuário removido com sucesso!')
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
      return response.status(500).json(error)
    }
  }
}
