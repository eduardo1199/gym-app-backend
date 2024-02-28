import { Request, Response } from 'express'
import { z } from 'zod'
import { RegisterAdminUseCase } from '../../use-cases/admin-use-cases/register'
import { PrismaAdminRepository } from '../../repositories/admin-repository/prisma-admin-repository'
import { AdminRegisterSchema } from '../../schemas/admin-register-schema'
import jwt from 'jsonwebtoken'
import { env } from '../../env'

export async function registerAdmin(request: Request, response: Response) {
  try {
    const { cpf, name, birthDate, password, year } = AdminRegisterSchema.parse(
      request.body,
    )

    const adminRepository = new PrismaAdminRepository()
    const registerAdminUseCase = new RegisterAdminUseCase(adminRepository)

    const { admin } = await registerAdminUseCase.execute({
      birthDate,
      cpf,
      name,
      password,
      year,
    })

    const token: string = jwt.sign(
      { id: admin.id, cpf: admin.cpf, name: admin.name },
      env.SECRET,
      {
        expiresIn: 60 * 60 * 24, // 24 hours
      },
    )

    return response.status(201).send({
      token,
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
      console.log(error)

      return response.status(500).json()
    }
  }
}
