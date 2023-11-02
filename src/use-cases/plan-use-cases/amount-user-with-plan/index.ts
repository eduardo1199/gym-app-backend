import { IPlanRepository } from '../../../repositories/plan-repository/iplan-repository'

interface AmountUserWithPlanUseCaseRequest {
  id: string
}

interface AmountUserWithPlanUseCaseResponse {
  amount: number
}

export class AmountUserWithPlanUseCase {
  constructor(private planRepository: IPlanRepository) {}

  async execute(
    data: AmountUserWithPlanUseCaseRequest,
  ): Promise<AmountUserWithPlanUseCaseResponse> {
    const plan = await this.planRepository.findById(data.id)

    if (!plan) {
      throw new Error('Not exist plan!')
    }

    const amount = await this.planRepository.findByCountUsersWithPlan(data.id)

    return {
      amount,
    }
  }
}
