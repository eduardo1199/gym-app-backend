import { Prisma, User } from '@prisma/client'

export interface IUserRepository {
  create(data: Prisma.UserCreateInput): Promise<{ user: User }>
  findByUserWithCpf(cpf: string): Promise<User | null>
  findByUserWithId(id: string): Promise<User | null>
  findByAllUsers(): Promise<User[]>
  deleteUser(id: string): Promise<void>
  updateUser(data: Prisma.UserUpdateInput, id: string): Promise<User>
}
