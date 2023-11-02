import { Plan } from '@prisma/client'
import { IPlanRepository } from '../../../repositories/plan-repository/iplan-repository'

interface UpdatePlanUseCaseRequest {
  name?: string
  timeOfPlan?: number
  price?: number
  id: string
}

interface UpdatePlanUseCaseResponse {
  plan: Plan
}

export class UpdatePlanUseCase {
  constructor(private planRepository: IPlanRepository) {}

  async execute(
    data: UpdatePlanUseCaseRequest,
  ): Promise<UpdatePlanUseCaseResponse> {
    const { name, timeOfPlan, price, id } = data

    const hasPlanById = await this.planRepository.findById(data.id)

    if (!hasPlanById) {
      throw new Error('Not exist plan!')
    }

    const hasPlanSomeNameOrTime =
      await this.planRepository.findBySomeNameAndTimeOfPlan(timeOfPlan, name)

    if (hasPlanSomeNameOrTime) {
      throw new Error('Plan already exists!')
    }

    const plan = await this.planRepository.update(
      {
        name,
        price,
        timeOfPlan,
      },
      id,
    )

    return {
      plan,
    }
  }
}
