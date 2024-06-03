import { User } from '@prisma/client'
import { IUserRepository } from '../../../repositories/user-repository/iuser-repository'
import { IPlanRepository } from '../../../repositories/plan-repository/iplan-repository'
import { add, subDays } from 'date-fns'
import { NotFoundError } from '../../../err/not-found-error'

interface EditUserUseCaseRequest {
  age?: number
  cpf?: string
  name?: string
  planId?: string
  weight?: number
  start_plan_date?: string
}

interface EditUserUseCaseResponse {
  user: User
}

export class EditUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private planRepository: IPlanRepository,
  ) {}

  async execute(data: EditUserUseCaseRequest, userId: string) {
    const hasUserWithCpf = await this.userRepository.findByUserWithId(userId)

    if (!hasUserWithCpf) {
      throw new NotFoundError('User')
    }

    const user = await this.userRepository.updateUser(data, userId)

    return {
      user,
    }
  }
}
