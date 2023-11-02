import { Plan } from '@prisma/client'
import { IPlanRepository } from '../../../repositories/plan-repository/iplan-repository'

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
      throw new Error('Not exist plan!')
    }

    return {
      plan,
    }
  }
}
