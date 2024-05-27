import { Request, Response } from 'express'
import { ParamsCPFRequestSchema } from '../../schemas/params-request-cpf'
import { AuthenticationUser } from '../../use-cases/users-cases/authentication-user'
import { PrismaUserRepository } from '../../repositories/user-repository/prisma-user-repository'
import { z } from 'zod'
import { NotFoundError } from '../../err/not-found-error'

export async function authenticateUser(request: Request, response: Response) {
  const { cpf } = ParamsCPFRequestSchema.parse(request.body)

  const userRepository = new PrismaUserRepository()
  const authenticationUserUseCase = new AuthenticationUser(userRepository)

  try {
    const user = await authenticationUserUseCase.execute(cpf)

    return response.status(200).json({ user })
  } catch (error) {
    if (error instanceof NotFoundError) {
      return response.status(409).json(error.message)
    }

    throw error
  }
}
