import { User } from '@prisma/client'
import { IUserRepository } from '../../../repositories/user-repository/iuser-repository'
import { IPlanRepository } from '../../../repositories/plan-repository/iplan-repository'
import { add } from 'date-fns'

interface RegisterUseCaseRequest {
  age: number
  cpf: string
  name: string
  planId: string
  weight: number
  startDateForPlan?: string
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
    data: RegisterUseCaseRequest,
  ): Promise<RegisterUseCaseResponse> {
    const hasUserWithCpf = await this.userRepository.findByUserWithCpf(data.cpf)

    if (hasUserWithCpf) {
      throw new Error()
    }

    const plan = await this.planRepository.findById(data.planId)

    if (!plan) {
      throw new Error()
    }

    const startForPlanDateFormat = data.startDateForPlan
      ? new Date(data.startDateForPlan)
      : new Date()

    const endForPlanDateFormat = add(startForPlanDateFormat, {
      days: plan.timeOfPlan,
    })

    const newUserData = {
      startDateForPlan: startForPlanDateFormat,
      endDateforPlan: endForPlanDateFormat,
      ...data,
    }

    const user = await this.userRepository.create(newUserData)

    return user
  }
}
