import { Plan, Prisma } from '@prisma/client'

export interface IPlanRepository {
  register(data: Prisma.PlanCreateInput): Promise<Plan>
  findByName(name: string): Promise<Plan | null>
  findBySomeNameAndTimeOfPlan(
    plan_month_time?: number,
    name?: string,
  ): Promise<Plan | null>
  findById(id: string): Promise<Plan | null>
  findByCountUsersWithPlan(id: string): Promise<number>
  findByAllPlans(): Promise<Plan[]>
  delete(id: string): Promise<void>
  update(data: Prisma.PlanUpdateInput, id: string): Promise<Plan>
}
