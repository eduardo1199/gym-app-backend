import { Machine } from '@prisma/client'
import { IMachineRepository } from '../../../repositories/machine-repository/imachine-repository'
import { NotFoundError } from '../../../err/not-found-error'

interface GetMachineUseCaseRequest {
  id: string
}

interface GetMachineUseCaseResponse {
  machine: Machine
}

export class GetMachineUseCase {
  constructor(private machineRepository: IMachineRepository) {}

  async execute(
    data: GetMachineUseCaseRequest,
  ): Promise<GetMachineUseCaseResponse> {
    const { id } = data

    const machine = await this.machineRepository.findByMachine(id)

    if (!machine) {
      throw new NotFoundError('Machine')
    }

    return {
      machine,
    }
  }
}
