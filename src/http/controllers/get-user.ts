import { Request, Response } from 'express'
import { ParamsIdRequestSchema } from '../../schemas/user'
import { PrismaUserRepository } from '../../repositories/user-repository/prisma-user-repository'
import { GetUserCase } from '../../use-cases/users-cases/getUser/get-user-case'
import { z } from 'zod'

export async function getUser(request: Request, response: Response) {
  try {
    const { id } = ParamsIdRequestSchema.parse(request.params)

    const userRepository = new PrismaUserRepository()
    const getUserCase = new GetUserCase(userRepository)

    const user = await getUserCase.execute({ id })

    return response.status(200).json({
      user,
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
      return response.status(500).json(error)
    }
  }
}
