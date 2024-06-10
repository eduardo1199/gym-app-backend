import { compare } from 'bcryptjs'
import { IAdminRepository } from '../../../repositories/admin-repository/iadmin-repository'
import { NotMatchPasswordOrCPF } from '../../../err/not-match-authentication'
import { NotFoundError } from '../../../err/not-found-error'

interface AuthenticationAdminUseCaseProps {
  password: string
  cpf: string
}

export class AuthenticationAdminUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute({ cpf, password }: AuthenticationAdminUseCaseProps) {
    const adminResponse = await this.adminRepository.authenticationAdmin(cpf)

    if (!adminResponse) {
      throw new NotFoundError('Admin')
    }

    const { admin } = adminResponse

    const isPasswordMath = await compare(password, admin.password)

    console.log(password, admin.password)

    if (!isPasswordMath) {
      throw new NotMatchPasswordOrCPF()
    }

    return adminResponse
  }
}
