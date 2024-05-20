import { NotFoundError } from '../../../err/not-found-error'
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
      throw new NotFoundError('Plan')
    }

    const amount = await this.planRepository.findByCountUsersWithPlan(data.id)

    return {
      amount,
    }
  }
}
