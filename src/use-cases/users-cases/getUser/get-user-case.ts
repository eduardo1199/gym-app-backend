import { User } from '@prisma/client'
import { IUserRepository } from '../../../repositories/user-repository/iuser-repository'
import { NotFoundError } from '../../../err/not-found-error'

interface GetUserCaseRequest {
  id: string
}

interface GetUserCaseResponse {
  user: User
}

export class GetUserCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: GetUserCaseRequest): Promise<GetUserCaseResponse> {
    const user = await this.userRepository.findByUserWithId(data.id)

    if (!user) {
      throw new NotFoundError('User')
    }

    return {
      user,
    }
  }
}
