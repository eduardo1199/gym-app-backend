import { Request, Response } from 'express'
import { z } from 'zod'
import { GetAllMachinesUseCase } from '../../use-cases/machine-use-cases/get-all-machine-use-case'
import { PrismaMachineRepository } from '../../repositories/machine-repository/prisma-machine-repository'

export async function getAllMachines(request: Request, response: Response) {
  const machineRepository = new PrismaMachineRepository()

  const getAllMachinesUseCase = new GetAllMachinesUseCase(machineRepository)

  const { machines } = await getAllMachinesUseCase.execute()

  return response.status(200).send({
    machines,
  })
}
