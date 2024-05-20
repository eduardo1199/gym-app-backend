import { Plan } from '@prisma/client'
import { IPlanRepository } from '../../../repositories/plan-repository/iplan-repository'
import { NotFoundError } from '../../../err/not-found-error'

interface GetPlanUseCaseRequest {
  id: string
}

interface GetPlanUseCaseResponse {
  plan: Plan
}

export class GetPlanUseCase {
  constructor(private planRepository: IPlanRepository) {}

  async execute(data: GetPlanUseCaseRequest): Promise<GetPlanUseCaseResponse> {
    const plan = await this.planRepository.findById(data.id)

    if (!plan) {
      throw new NotFoundError('Plan')
    }

    return {
      plan,
    }
  }
}
