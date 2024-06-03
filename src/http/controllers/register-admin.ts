import { Request, Response } from 'express'
import { z } from 'zod'
import { RegisterAdminUseCase } from '../../use-cases/admin-use-cases/register'
import { PrismaAdminRepository } from '../../repositories/admin-repository/prisma-admin-repository'
import { AdminRegisterSchema } from '../../schemas/admin-register-schema'
import jwt from 'jsonwebtoken'
import { env } from '../../env'
import { NotFoundError } from '../../err/not-found-error'

export async function registerAdmin(
  request: Request,
  response: Response,
  next: any,
) {
  try {
    const { cpf, name, birth_date, password, year } = AdminRegisterSchema.parse(
      request.body,
    )

    const adminRepository = new PrismaAdminRepository()
    const registerAdminUseCase = new RegisterAdminUseCase(adminRepository)

    const { admin } = await registerAdminUseCase.execute({
      birth_date,
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
    if (error instanceof NotFoundError) {
      return response.status(409).json({
        message: error.message,
      })
    }

    next(error)
  }
}
