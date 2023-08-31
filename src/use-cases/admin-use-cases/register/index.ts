import { Admin } from '@prisma/client'
import { IAdminRepository } from '../../../repositories/admin-repository/iadmin-repository'

interface RegisterAdminUseCaseRequest {
  year: string
  cpf: string
  name: string
  birthDate: string
  password: string
}

interface RegisterAdminUseCaseResponse {
  admin: Admin
}

export class RegisterAdminUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute(
    data: RegisterAdminUseCaseRequest,
  ): Promise<RegisterAdminUseCaseResponse> {
    const hasAdminWithCpf = await this.adminRepository.getAdminWithSomeCpf(
      data.cpf,
    )

    if (hasAdminWithCpf) {
      throw new Error()
    }

    const admin = await this.adminRepository.create(data)

    return admin
  }
}
