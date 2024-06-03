import { Request, Response } from 'express'
import { ParamsIdRequestSchema } from '../../schemas/user'
import { PrismaAdminRepository } from '../../repositories/admin-repository/prisma-admin-repository'
import { GetAdminUseCase } from '../../use-cases/admin-use-cases/get-admin'
import { z } from 'zod'
import { NotFoundError } from '../../err/not-found-error'

export async function getAdmin(
  request: Request,
  response: Response,
  next: any,
) {
  try {
    const { id } = ParamsIdRequestSchema.parse(request.params)

    const adminRepository = new PrismaAdminRepository()
    const getAdminUseCase = new GetAdminUseCase(adminRepository)

    const { admin } = await getAdminUseCase.execute({ id })

    return response.status(200).json({
      admin,
    })
  } catch (error) {
    if (error instanceof NotFoundError) {
      return response.status(409).json({
        message: error.message,
      })
    }

    next(error)
  }
}
