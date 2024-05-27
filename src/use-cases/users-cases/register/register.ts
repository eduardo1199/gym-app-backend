import { User } from '@prisma/client'
import { IUserRepository } from '../../../repositories/user-repository/iuser-repository'
import { IPlanRepository } from '../../../repositories/plan-repository/iplan-repository'
import { add } from 'date-fns'
import { NotFoundError } from '../../../err/not-found-error'
import { SameCpfError } from '../../../err/same-cof-error'

interface RegisterUseCaseRequest {
  age: number
  cpf: string
  name: string
  planId: string
  weight: number
  start_plan_date: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private planRepository: IPlanRepository,
  ) {}

  async execute(
    userParams: RegisterUseCaseRequest,
  ): Promise<RegisterUseCaseResponse> {
    const hasUserWithCpf = await this.userRepository.findByUserWithCpf(
      userParams.cpf,
    )

    if (hasUserWithCpf) {
      throw new SameCpfError()
    }

    const plan = await this.planRepository.findById(userParams.planId)

    if (!plan) {
      throw new NotFoundError('Plan')
    }

    const startForPlanDateFormat = new Date(userParams.start_plan_date)

    const endForPlanDateFormat = add(startForPlanDateFormat, {
      days: plan.plan_month_time,
    })

    const { age, cpf, name, planId, weight } = userParams

    const newUserData = {
      age,
      cpf,
      finish_plan_date: endForPlanDateFormat,
      name,
      planId,
      weight,
      start_plan_date: startForPlanDateFormat,
    }

    const user = await this.userRepository.create(newUserData)

    return user
  }
}
