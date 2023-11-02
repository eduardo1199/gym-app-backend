import { Request, Response } from 'express'
import { z } from 'zod'
import { RegisterAdminUseCase } from '../../use-cases/admin-use-cases/register'
import { PrismaAdminRepository } from '../../repositories/admin-repository/prisma-admin-repository'
import { AdminRegisterSchema } from '../../schemas/admin-register-schema'

export async function registerAdmin(request: Request, response: Response) {
  try {
    const { cpf, name, birthDate, password, year } = AdminRegisterSchema.parse(
      request.body,
    )

    const adminRepository = new PrismaAdminRepository()
    const registerAdminUseCase = new RegisterAdminUseCase(adminRepository)

    await registerAdminUseCase.execute({
      birthDate,
      cpf,
      name,
      password,
      year,
    })

    return response.status(201).send('Administrador cadastrado com sucesso!')
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
      console.log(error)

      return response.status(500).json()
    }
  }
}
