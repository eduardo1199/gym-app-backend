import { Request, Response } from 'express'
import {
  MachineIdSchema,
  MachineRequestUpdateSchema,
} from '../../schemas/machine'
import { z } from 'zod'
import { GetMachineUseCase } from '../../use-cases/machine-use-cases/get-machine-use-case'
import { PrismaMachineRepository } from '../../repositories/machine-repository/prisma-machine-repository'
import { NotFoundError } from '../../err/not-found-error'

export async function getMachine(
  request: Request,
  response: Response,
  next: any,
) {
  try {
    const { id } = MachineIdSchema.parse(request.params)

    const machineRepository = new PrismaMachineRepository()

    const getMachineUseCase = new GetMachineUseCase(machineRepository)

    const { machine } = await getMachineUseCase.execute({
      id,
    })

    return response.status(200).send({
      machine,
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
