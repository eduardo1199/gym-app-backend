import { Prisma, User } from '@prisma/client'
import { IUserRepository } from './iuser-repository'
import { prisma } from '../../prismaClient'

export class PrismaUserRepository implements IUserRepository {
  async create(data: Prisma.UserCreateInput): Promise<{ user: User }> {
    const user = await prisma.user.create({
      data,
    })

    return {
      user,
    }
  }

  async findByUserWithCpf(cpf: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    return user
  }

  async findByUserWithId(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async findByAllUsers(): Promise<User[]> {
    const user = await prisma.user.findMany()

    return user
  }

  async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({
      where: {
        id,
      },
    })
  }

  async updateUser(data: Prisma.UserUpdateInput, id: string): Promise<User> {
    const user = await prisma.user.update({
      data,
      where: {
        id,
      },
    })

    return user
  }
}
