import { Request, Response } from 'express'
import { MachineRequestCreatedSchema } from '../../schemas/machine'
import { z } from 'zod'
import { CreateMachineUseCase } from '../../use-cases/machine-use-cases/create-machine-use-case'
import { PrismaMachineRepository } from '../../repositories/machine-repository/prisma-machine-repository'

export async function registerMachine(request: Request, response: Response) {
  try {
    const { description, maintenance, name } =
      MachineRequestCreatedSchema.parse(request.body)

    const machineRepository = new PrismaMachineRepository()

    const registerMachineUseCase = new CreateMachineUseCase(machineRepository)

    await registerMachineUseCase.execute({
      description,
      maintenance,
      name,
    })

    return response.status(201).send('Maquinário cadastrado com sucesso!')
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
