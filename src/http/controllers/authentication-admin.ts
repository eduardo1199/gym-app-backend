import { Request, Response } from 'express'
import { AuthenticationAdminUseCase } from '../../use-cases/admin-use-cases/authentication'
import { PrismaAdminRepository } from '../../repositories/admin-repository/prisma-admin-repository'
import { z } from 'zod'
import { AdminAuthenticationSchema } from '../../schemas/admin-schema-authentication'
import jwt from 'jsonwebtoken'
import { env } from '../../env'
import { NotMatchPasswordOrCPF } from '../../err/not-match-authentication'

export async function authenticateAdmin(request: Request, response: Response) {
  try {
    const { cpf, password } = AdminAuthenticationSchema.parse(request.body)

    const adminRepository = new PrismaAdminRepository()
    const authenticationAdminUseCase = new AuthenticationAdminUseCase(
      adminRepository,
    )

    const { admin } = await authenticationAdminUseCase.execute({
      cpf,
      password,
    })

    const adminPayload = { id: admin.id, cpf: admin.cpf, name: admin.name }

    const token: string = jwt.sign(adminPayload, env.SECRET, {
      expiresIn: 60 * 60 * 24, // 24 hours
    })

    return response.status(200).json({ token })
  } catch (error) {
    if (error instanceof NotMatchPasswordOrCPF) {
      return response.status(409).json({
        message: error.message,
      })
    }

    throw error
  }
}
