import { Admin, Prisma, User } from '@prisma/client'

export interface IAdminRepository {
  create(data: Prisma.AdminCreateInput): Promise<{ admin: Admin }>
  authenticationAdmin(cpf: string): Promise<{ admin: Admin } | null>
  getAdmin(id: string): Promise<{ admin: Admin } | null>
  getAdminWithSomeCpf(cpf: string): Promise<true | false>
}
