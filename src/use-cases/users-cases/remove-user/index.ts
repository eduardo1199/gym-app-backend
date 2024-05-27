import { NotFoundError } from '../../../err/not-found-error'
import { IUserRepository } from '../../../repositories/user-repository/iuser-repository'

export class RemoveUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string) {
    const user = await this.userRepository.findByUserWithId(id)

    if (!user) {
      throw new NotFoundError('User')
    }

    await this.userRepository.deleteUser(id)
  }
}
