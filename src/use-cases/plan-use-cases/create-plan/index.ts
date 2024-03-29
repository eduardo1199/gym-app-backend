import { Plan } from '@prisma/client'
import { IPlanRepository } from '../../../repositories/plan-repository/iplan-repository'

interface CreatePlanUseCaseRequest {
  name: string
  timeOfPlan: number
  price: number
}

interface CreatePlanUseCaseResponse {
  plan: Plan
}

export class CreatePlanUseCase {
  constructor(private planRepository: IPlanRepository) {}

  async execute(
    data: CreatePlanUseCaseRequest,
  ): Promise<CreatePlanUseCaseResponse> {
    const { name, timeOfPlan, price } = data

    const hasPlanSomeNameOrTime =
      await this.planRepository.findBySomeNameAndTimeOfPlan(timeOfPlan, name)

    if (hasPlanSomeNameOrTime) {
      throw new Error('Plan already exists!')
    }

    const plan = await this.planRepository.register({
      name,
      price,
      timeOfPlan,
    })

    return {
      plan,
    }
  }
}
