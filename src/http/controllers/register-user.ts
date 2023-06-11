import { Request, Response } from 'express'
import { registerUserSchema } from '../../schemas/user'
import { z } from 'zod'
import { RegisterUseCase } from '../../use-cases/users-cases/register/register'
import { PrismaUserRepository } from '../../repositories/user-repository/prisma-user-repository'
import { PrismaPlanRepository } from '../../repositories/plan-repository/prisma-plan-repository'

export async function registerUser(request: Request, response: Response) {
  try {
    const { age, cpf, name, planId, weight, startDateForPlan } =
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
      startDateForPlan,
    })

    return response.status(201).send('Aluno cadastrado com sucesso!')
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
