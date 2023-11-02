import { Plan } from '@prisma/client'
import { IPlanRepository } from '../../../repositories/plan-repository/iplan-repository'

interface GetAllPlansUseCaseResponse {
  plans: Plan[]
}

export class GetAllPlansUseCase {
  constructor(private planRepository: IPlanRepository) {}

  async execute(): Promise<GetAllPlansUseCaseResponse> {
    const plans = await this.planRepository.findByAllPlans()

    return {
      plans,
    }
  }
}
