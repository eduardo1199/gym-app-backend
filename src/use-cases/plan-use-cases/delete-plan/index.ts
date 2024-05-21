import { Plan } from '@prisma/client'
import { IPlanRepository } from '../../../repositories/plan-repository/iplan-repository'
import { NotFoundError } from '../../../err/not-found-error'

interface DeletePlanUseCaseRequest {
  id: string
}

export class DeletePlanUseCase {
  constructor(private planRepository: IPlanRepository) {}

  async execute(data: DeletePlanUseCaseRequest) {
    const plan = await this.planRepository.findById(data.id)

    if (!plan) {
      throw new NotFoundError('Plan')
    }

    await this.planRepository.delete(data.id)
  }
}
