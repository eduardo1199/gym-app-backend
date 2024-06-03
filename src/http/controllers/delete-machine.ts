import { Request, Response } from 'express'
import {
  MachineIdSchema,
  MachineRequestUpdateSchema,
} from '../../schemas/machine'
import { z } from 'zod'
import { DeleteMachineUseCase } from '../../use-cases/machine-use-cases/delete-machine-use-case'
import { PrismaMachineRepository } from '../../repositories/machine-repository/prisma-machine-repository'
import { NotFoundError } from '../../err/not-found-error'

export async function deleteMachine(
  request: Request,
  response: Response,
  next: any,
) {
  try {
    const { id } = MachineIdSchema.parse(request.params)

    const machineRepository = new PrismaMachineRepository()

    const deleteMachineUseCase = new DeleteMachineUseCase(machineRepository)

    await deleteMachineUseCase.execute({
      id,
    })

    return response.status(204).send('Maquinário excluído com sucesso!')
  } catch (error) {
    if (error instanceof NotFoundError) {
      return response.status(409).json({
        message: error.message,
      })
    }

    next(error)
  }
}
