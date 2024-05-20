import { compare } from 'bcryptjs'
import { IAdminRepository } from '../../../repositories/admin-repository/iadmin-repository'
import { NotMatchPasswordOrCPF } from '../../../err/not-match-authentication'

interface AuthenticationAdminUseCaseProps {
  password: string
  cpf: string
}

export class AuthenticationAdminUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute({ cpf, password }: AuthenticationAdminUseCaseProps) {
    const adminResponse = await this.adminRepository.authenticationAdmin(cpf)

    if (!adminResponse) {
      throw new NotMatchPasswordOrCPF()
    }

    const { admin } = adminResponse

    const isPasswordCorrectlyHash = await compare(password, admin.password)

    if (isPasswordCorrectlyHash) {
      throw new NotMatchPasswordOrCPF()
    }

    return adminResponse
  }
}
