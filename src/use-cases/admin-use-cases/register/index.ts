import { Admin } from '@prisma/client'
import { IAdminRepository } from '../../../repositories/admin-repository/iadmin-repository'
import { hash } from 'bcryptjs'
import { NotFoundError } from '../../../err/not-found-error'
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

  async execute({
    birthDate,
    cpf,
    name,
    password,
    year,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const hasAdminWithCpf = await this.adminRepository.getAdminWithSomeCpf(cpf)

    if (hasAdminWithCpf) {
      throw new NotFoundError('Admin')
    }

    const password_hash = await hash(password, 6)

    const admin = await this.adminRepository.create({
      birthDate,
      cpf,
      name,
      password: password_hash,
      year,
    })

    return admin
  }
}
