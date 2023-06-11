import { User } from '@prisma/client'
import { IUserRepository } from '../../../repositories/user-repository/iuser-repository'
import { compareAsc } from 'date-fns'

interface GetAllUsersCaseResponse extends User {
  isActive: boolean
}

export class GetAllUsersCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<GetAllUsersCaseResponse[]> {
    const usersData = await this.userRepository.findByAllUsers()

    const users = usersData.map((user) => {
      const isActive = compareAsc(user.endDateforPlan, user.startDateForPlan)

      return {
        ...user,
        isActive: isActive !== -1,
      }
    })

    return users
  }
}
