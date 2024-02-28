import { Request, Response } from 'express'
import { ParamsCPFRequestSchema } from '../../schemas/params-request-cpf'
import { AuthenticationUser } from '../../use-cases/users-cases/authentication-user'
import { PrismaUserRepository } from '../../repositories/user-repository/prisma-user-repository'
import { z } from 'zod'

export async function authenticateUser(request: Request, response: Response) {
  try {
    const { cpf } = ParamsCPFRequestSchema.parse(request.body)

    const userRepository = new PrismaUserRepository()
    const authenticationUserUseCase = new AuthenticationUser(userRepository)

    const user = await authenticationUserUseCase.execute(cpf)

    return response.status(200).json({ user })
  } catch (err) {
    if (err instanceof z.ZodError) {
      const errorsZodResponse = err.issues.map((issue) => {
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
