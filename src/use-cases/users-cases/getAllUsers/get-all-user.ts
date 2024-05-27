import { User } from '@prisma/client'
import { IUserRepository } from '../../../repositories/user-repository/iuser-repository'

interface GetAllUsersCaseResponse {
  users: User[]
}
export class GetAllUsersCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<GetAllUsersCaseResponse> {
    const users = await this.userRepository.findByAllUsers()

    return {
      users,
    }
  }
}
