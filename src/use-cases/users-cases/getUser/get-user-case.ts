import { User } from '@prisma/client'
import { IUserRepository } from '../../../repositories/user-repository/iuser-repository'
import { compareAsc, formatDistance } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface GetUserCaseRequest {
  id: string
}

interface GetUserCaseResponse extends User {
  isActive: boolean
  timeFinishPlan: string
}

export class GetUserCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: GetUserCaseRequest): Promise<GetUserCaseResponse> {
    const user = await this.userRepository.findByUserWithId(data.id)

    if (!user) {
      throw new Error()
    }

    const isActive = compareAsc(user.endDateforPlan, user.startDateForPlan)

    const userResponse = {
      ...user,
      isActive: isActive !== -1,
      timeFinishPlan: formatDistance(
        user.startDateForPlan,
        user.endDateforPlan,
        {
          locale: ptBR,
        },
      ),
    }

    return userResponse
  }
}
