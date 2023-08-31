import { IAdminRepository } from '../../../repositories/admin-repository/iadmin-repository'

interface AuthenticationAdminUseCaseProps {
  password: string
  cpf: string
}

export default class AuthenticationAdminUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute(data: AuthenticationAdminUseCaseProps) {
    const adminResponse = await this.adminRepository.authenticationAdmin(
      data.cpf,
    )

    if (!adminResponse) {
      throw new Error()
    }

    const { admin } = adminResponse

    if (data.password !== admin.password) {
      throw new Error()
    }

    return adminResponse
  }
}
