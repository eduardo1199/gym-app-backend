import { Request, Response } from 'express'
import { PrismaUserRepository } from '../../repositories/user-repository/prisma-user-repository'
import { GetAllUsersCase } from '../../use-cases/users-cases/getAllUsers/get-all-user'

export async function getAllUsers(request: Request, response: Response) {
  const userRepository = new PrismaUserRepository()
  const getAllUsersCase = new GetAllUsersCase(userRepository)

  const users = await getAllUsersCase.execute()

  return response.status(200).json(users)
}
