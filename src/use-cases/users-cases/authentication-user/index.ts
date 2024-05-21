import { NotFoundError } from '../../../err/not-found-error'
import { IUserRepository } from '../../../repositories/user-repository/iuser-repository'

export class AuthenticationUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(cpf: string) {
    const user = await this.userRepository.findByUserWithCpf(cpf)

    if (!user) {
      throw new NotFoundError('User')
    }

    return user
  }
}
