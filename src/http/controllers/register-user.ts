import { Request, Response } from 'express'
import { registerUserSchema } from '../../schemas/user'
import { z } from 'zod'
import { RegisterUseCase } from '../../use-cases/users-cases/register/register'
import { PrismaUserRepository } from '../../repositories/user-repository/prisma-user-repository'
import { PrismaPlanRepository } from '../../repositories/plan-repository/prisma-plan-repository'
import { SameCpfError } from '../../err/same-cof-error'
import { NotFoundError } from '../../err/not-found-error'

export async function registerUser(
  request: Request,
  response: Response,
  next: any,
) {
  try {
    const { age, cpf, name, planId, weight, start_plan_date } =
      registerUserSchema.parse(request.body)

    const userRepository = new PrismaUserRepository()
    const planRepository = new PrismaPlanRepository()

    const registerUseCase = new RegisterUseCase(userRepository, planRepository)

    await registerUseCase.execute({
      age,
      cpf,
      name,
      planId,
      weight,
      start_plan_date,
    })

    return response.status(201).send('Aluno cadastrado com sucesso!')
  } catch (error) {
    if (error instanceof SameCpfError || error instanceof NotFoundError) {
      return response.status(409).json({
        message: error.message,
      })
    }

    next(error)
  }
}
