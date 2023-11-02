import { compare } from 'bcryptjs'
import { IAdminRepository } from '../../../repositories/admin-repository/iadmin-repository'

interface AuthenticationAdminUseCaseProps {
  password: string
  cpf: string
}

export class AuthenticationAdminUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute({ cpf, password }: AuthenticationAdminUseCaseProps) {
    const adminResponse = await this.adminRepository.authenticationAdmin(cpf)

    if (!adminResponse) {
      throw new Error()
    }

    const { admin } = adminResponse

    const isPasswordCorrectlyHash = await compare(password, admin.password)

    if (isPasswordCorrectlyHash) {
      throw new Error()
    }

    return adminResponse
  }
}
