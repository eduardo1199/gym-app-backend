import { Prisma, Plan } from '@prisma/client'
import { IPlanRepository } from './iplan-repository'
import { prisma } from '../../prismaClient'

export class PrismaPlanRepository implements IPlanRepository {
  async register(data: Prisma.PlanCreateInput): Promise<Plan> {
    const plan = await prisma.plan.create({
      data,
    })

    return plan
  }

  async findByName(name: string): Promise<Plan | null> {
    const plan = await prisma.plan.findUnique({
      where: {
        name,
      },
    })

    if (!plan) {
      return null
    }

    return plan
  }

  async findByTimeOfPlan(time: number): Promise<Plan | null> {
    const plan = await prisma.plan.findUnique({
      where: {
        timeOfPlan: time,
      },
    })

    if (!plan) {
      return null
    }

    return plan
  }

  async findById(id: string): Promise<Plan | null> {
    const plan = await prisma.plan.findUnique({
      where: {
        id,
      },
    })

    if (!plan) {
      return null
    }

    return plan
  }

  async findByCountUsersWithPlan(id: string): Promise<number> {
    const plan = await prisma.plan.findUnique({
      where: {
        id,
      },
      select: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    })

    if (!plan?._count) {
      return 0
    }

    return plan._count.users
  }

  async findByAllPlans(): Promise<Plan[]> {
    const plans = await prisma.plan.findMany()

    return plans
  }

  async delete(id: string): Promise<void> {
    await prisma.plan.delete({
      where: {
        id,
      },
    })
  }

  async update(data: Prisma.PlanUpdateInput, id: string): Promise<Plan> {
    const plan = await prisma.plan.update({
      data,
      where: { id },
    })

    return plan
  }
}
