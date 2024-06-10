import { Request, Response } from 'express'
import { ParamsIdRequestSchema } from '../../schemas/user'
import { PrismaUserRepository } from '../../repositories/user-repository/prisma-user-repository'
import { GetUserCase } from '../../use-cases/users-cases/getUser/get-user-case'
import { z } from 'zod'
import { NotFoundError } from '../../err/not-found-error'

export async function getUser(request: Request, response: Response, next: any) {
  try {
    const { id } = ParamsIdRequestSchema.parse(request.params)

    const userRepository = new PrismaUserRepository()
    const getUserCase = new GetUserCase(userRepository)

    const user = await getUserCase.execute({ id })

    return response.status(200).json(user)
  } catch (error) {
    if (error instanceof NotFoundError) {
      return response.status(409).json({
        message: error.message,
      })
    }

    next(error)
  }
}
