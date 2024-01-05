import { IMachineRepository } from '../../../repositories/machine-repository/imachine-repository'

interface DeleteMachineUseCaseRequest {
  id: string
}

export class DeleteMachineUseCase {
  constructor(private machineRepository: IMachineRepository) {}

  async execute(data: DeleteMachineUseCaseRequest): Promise<void> {
    const { id } = data

    const machine = await this.machineRepository.findByMachine(id)

    if (!machine) {
      throw new Error('Machine not exists!')
    }

    await this.machineRepository.deleteMachine(id)
  }
}
