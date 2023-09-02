import { IAdminRepository } from '../../../repositories/admin-repository/iadmin-repository'

interface GetAdminUseCaseProps {
  id: string
}

export class GetAdminUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute(data: GetAdminUseCaseProps) {
    const admin = await this.adminRepository.getAdmin(data.id)

    if (!admin) {
      throw new Error()
    }

    return admin
  }
}
