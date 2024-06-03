import { Request, Response } from 'express'
import {
  MachineIdSchema,
  MachineRequestUpdateSchema,
} from '../../schemas/machine'
import { z } from 'zod'
import { UpdateMachineUseCase } from '../../use-cases/machine-use-cases/update-machine-use-case'
import { PrismaMachineRepository } from '../../repositories/machine-repository/prisma-machine-repository'
import { NotFoundError } from '../../err/not-found-error'

export async function updateMachine(
  request: Request,
  response: Response,
  next: any,
) {
  try {
    const { description, maintenance, name } = MachineRequestUpdateSchema.parse(
      request.body,
    )

    const { id } = MachineIdSchema.parse(request.params)

    const machineRepository = new PrismaMachineRepository()

    const updateMachineUseCase = new UpdateMachineUseCase(machineRepository)

    await updateMachineUseCase.execute({
      description,
      maintenance,
      name,
      id,
    })

    return response.status(201).send('Maquinário atualizado com sucesso!')
  } catch (error) {
    if (error instanceof NotFoundError) {
      return response.status(409).json({
        message: error.message,
      })
    }

    next(error)
  }
}
