import { Request, Response } from 'express'
import {
  MachineIdSchema,
  MachineRequestUpdateSchema,
} from '../../schemas/machine'
import { z } from 'zod'
import { DeleteMachineUseCase } from '../../use-cases/machine-use-cases/delete-machine-use-case'
import { PrismaMachineRepository } from '../../repositories/machine-repository/prisma-machine-repository'

export async function deleteMachine(request: Request, response: Response) {
  try {
    const { id } = MachineIdSchema.parse(request.params)

    const machineRepository = new PrismaMachineRepository()

    const deleteMachineUseCase = new DeleteMachineUseCase(machineRepository)

    await deleteMachineUseCase.execute({
      id,
    })

    return response.status(204).send('Maquinário excluído com sucesso!')
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
