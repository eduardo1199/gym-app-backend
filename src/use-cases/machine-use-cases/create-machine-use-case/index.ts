import { Machine } from '@prisma/client'
import { IMachineRepository } from '../../../repositories/machine-repository/imachine-repository'
import { SameNameMachineError } from '../../../err/same-name-error-machine'

interface CreateMachineUseCaseRequest {
  name: string
  description: string
  maintenance: boolean
}

interface CreateMachineUseCaseResponse {
  machine: Machine
}

export class CreateMachineUseCase {
  constructor(private machineRepository: IMachineRepository) {}

  async execute(
    data: CreateMachineUseCaseRequest,
  ): Promise<CreateMachineUseCaseResponse> {
    const { description, name, maintenance } = data

    const hasMachineWithName =
      await this.machineRepository.findBySomeMachineName(name)

    if (hasMachineWithName) {
      throw new SameNameMachineError()
    }

    const machine = await this.machineRepository.register({
      name,
      description,
      maintenance,
    })

    return {
      machine,
    }
  }
}
