import { Admin, Prisma, User } from '@prisma/client'
import { IAdminRepository } from './iadmin-repository'
import { prisma } from '../../prismaClient'

export class PrismaAdminRepository implements IAdminRepository {
  async create(data: Prisma.AdminCreateInput): Promise<{ admin: Admin }> {
    const admin = await prisma.admin.create({
      data,
    })

    return {
      admin,
    }
  }

  async authenticationAdmin(cpf: string): Promise<{ admin: Admin } | null> {
    const admin = await prisma.admin.findUnique({
      where: {
        cpf,
      },
    })

    if (!admin) return null

    return { admin }
  }

  async getAdmin(id: string): Promise<{ admin: Admin } | null> {
    const admin = await prisma.admin.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return {
      admin,
    }
  }

  async getAdminWithSomeCpf(cpf: string): Promise<boolean> {
    const admin = await prisma.admin.findUnique({
      where: {
        cpf,
      },
    })

    if (admin) {
      return true
    } else {
      return false
    }
  }
}
