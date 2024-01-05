import { Machine } from '@prisma/client'
import { IMachineRepository } from '../../../repositories/machine-repository/imachine-repository'

interface GetAllMachinesUseCaseResponse {
  machines: Machine[]
}

export class GetAllMachinesUseCase {
  constructor(private machineRepository: IMachineRepository) {}

  async execute(): Promise<GetAllMachinesUseCaseResponse> {
    const machines = await this.machineRepository.findByAllMachines()

    return {
      machines,
    }
  }
}
