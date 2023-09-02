import { Request, Response } from 'express'
import { AuthenticationAdminUseCase } from '../../use-cases/admin-use-cases/authentication'
import { PrismaAdminRepository } from '../../repositories/admin-repository/prisma-admin-repository'
import { z } from 'zod'
import { AdminAuthenticationSchema } from '../../schemas/admin-schema-authentication'

export async function authenticateAdmin(request: Request, response: Response) {
  try {
    const { cpf, password } = AdminAuthenticationSchema.parse(request.params)

    const adminRepository = new PrismaAdminRepository()
    const authenticationAdminUseCase = new AuthenticationAdminUseCase(
      adminRepository,
    )

    const { admin } = await authenticationAdminUseCase.execute({
      cpf,
      password,
    })

    return response.status(200).json({ admin })
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
