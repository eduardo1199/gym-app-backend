import { Plan } from '@prisma/client'
import { IPlanRepository } from '../../../repositories/plan-repository/iplan-repository'
import { SameNameOrPeriodTimePlanError } from '../../../err/same-name-or-time-plan-error'

interface CreatePlanUseCaseRequest {
  name: string
  plan_month_time: number
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
    const { name, plan_month_time, price } = data

    const hasPlanSomeNameOrTime =
      await this.planRepository.findBySomeNameAndTimeOfPlan(
        plan_month_time,
        name,
      )

    if (hasPlanSomeNameOrTime) {
      throw new SameNameOrPeriodTimePlanError()
    }

    const plan = await this.planRepository.register({
      name,
      price,
      plan_month_time,
    })

    return {
      plan,
    }
  }
}
