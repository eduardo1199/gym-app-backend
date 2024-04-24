import { Request, Response } from 'express'
import {
  MachineIdSchema,
  MachineRequestUpdateSchema,
} from '../../schemas/machine'
import { z } from 'zod'
import { UpdateMachineUseCase } from '../../use-cases/machine-use-cases/update-machine-use-case'
import { PrismaMachineRepository } from '../../repositories/machine-repository/prisma-machine-repository'

export async function updateMachine(request: Request, response: Response) {
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
