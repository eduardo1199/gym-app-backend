import { Plan } from '@prisma/client'
import { IPlanRepository } from '../../../repositories/plan-repository/iplan-repository'
import { NotFoundError } from '../../../err/not-found-error'
import { SameNameOrPeriodTimePlanError } from '../../../err/same-name-or-time-plan-error'

interface UpdatePlanUseCaseRequest {
  name?: string
  plan_month_time?: number
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
    const { name, plan_month_time, price, id } = data

    const hasPlanById = await this.planRepository.findById(data.id)

    if (!hasPlanById) {
      throw new NotFoundError('Plan')
    }

    const hasPlanSomeNameOrTime =
      await this.planRepository.findBySomeNameAndTimeOfPlan(
        plan_month_time,
        name,
      )

    if (hasPlanSomeNameOrTime) {
      throw new SameNameOrPeriodTimePlanError()
    }

    const plan = await this.planRepository.update(
      {
        name,
        price,
        plan_month_time,
      },
      id,
    )

    return {
      plan,
    }
  }
}
