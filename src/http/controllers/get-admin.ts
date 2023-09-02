import { Request, Response } from 'express'
import { ParamsIdRequestSchema } from '../../schemas/user'
import { PrismaAdminRepository } from '../../repositories/admin-repository/prisma-admin-repository'
import { GetAdminUseCase } from '../../use-cases/admin-use-cases/get-admin'
import { z } from 'zod'

export async function getAdmin(request: Request, response: Response) {
  try {
    const { id } = ParamsIdRequestSchema.parse(request.params)

    const adminRepository = new PrismaAdminRepository()
    const getAdminUseCase = new GetAdminUseCase(adminRepository)

    const { admin } = await getAdminUseCase.execute({ id })

    return response.status(200).json({
      admin,
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
