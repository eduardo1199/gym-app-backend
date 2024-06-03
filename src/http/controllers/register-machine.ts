import { Request, Response } from 'express'
import { MachineRequestCreatedSchema } from '../../schemas/machine'
import { z } from 'zod'
import { CreateMachineUseCase } from '../../use-cases/machine-use-cases/create-machine-use-case'
import { PrismaMachineRepository } from '../../repositories/machine-repository/prisma-machine-repository'
import { SameNameMachineError } from '../../err/same-name-error-machine'

export async function registerMachine(
  request: Request,
  response: Response,
  next: any,
) {
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
    if (error instanceof SameNameMachineError) {
      return response.status(409).json({
        message: error.message,
      })
    }

    next(error)
  }
}
