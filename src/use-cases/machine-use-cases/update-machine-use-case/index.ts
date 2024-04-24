import { Machine } from '@prisma/client'
import { IMachineRepository } from '../../../repositories/machine-repository/imachine-repository'

interface UpdateMachineUseCaseRequest {
  name?: string
  description?: string
  maintenance?: boolean
  id: string
}

interface UpdateMachineUseCaseResponse {
  machine: Machine
}

export class UpdateMachineUseCase {
  constructor(private machineRepository: IMachineRepository) {}

  async execute(
    data: UpdateMachineUseCaseRequest,
  ): Promise<UpdateMachineUseCaseResponse> {
    const { description, name, maintenance, id } = data

    const getMachineById = await this.machineRepository.findByMachine(id)

    if (!getMachineById) {
      throw new Error('Machine not exists!')
    }

    const machine = await this.machineRepository.updateMachine(
      {
        description,
        maintenance,
        name,
      },
      id,
    )

    return {
      machine,
    }
  }
}
