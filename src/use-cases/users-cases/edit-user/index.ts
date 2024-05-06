import { User } from '@prisma/client'
import { IUserRepository } from '../../../repositories/user-repository/iuser-repository'
import { IPlanRepository } from '../../../repositories/plan-repository/iplan-repository'
import { add, subDays } from 'date-fns'

interface EditUserUseCaseRequest {
  age?: number
  cpf?: string
  name?: string
  planId?: string
  weight?: number
  startDateForPlan?: string
}

export class EditUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private planRepository: IPlanRepository,
  ) {}

  async execute(data: EditUserUseCaseRequest, userId: string) {
    const hasUserWithCpf = await this.userRepository.findByUserWithId(userId)

    if (!hasUserWithCpf) {
      throw new Error()
    }

    let plan
    let endDateforPlan

    const currentDate = new Date()
    const { age, cpf, name, planId, weight, startDateForPlan } = data

    if (data.planId) {
      plan = await this.planRepository.findById(data.planId)

      if (startDateForPlan) {
        endDateforPlan = add(new Date(startDateForPlan), {
          days: plan?.timeOfPlan ?? 0,
        })
      } else {
        endDateforPlan = add(currentDate, {
          days: plan?.timeOfPlan ?? 0,
        })
      }

      if (!plan) {
        endDateforPlan = subDays(currentDate, 1)
      }
    }

    const newUserData = {
      age,
      cpf,
      endDateforPlan,
      name,
      planId,
      weight,
      startDateForPlan,
    }

    const user = await this.userRepository.updateUser(newUserData, userId)

    return user
  }
}
