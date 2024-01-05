import { Prisma, Machine } from '@prisma/client'
import { IMachineRepository } from './imachine-repository'
import { prisma } from '../../prismaClient'

export class PrismaMachineRepository implements IMachineRepository {
  async register(data: Prisma.MachineCreateInput): Promise<Machine> {
    const machine = await prisma.machine.create({
      data,
    })

    return machine
  }

  async findByAllMachines(): Promise<Machine[]> {
    const machines = await prisma.machine.findMany()

    return machines
  }

  async updateMachine(
    data: Prisma.MachineUpdateInput,
    id: string,
  ): Promise<Machine> {
    const machine = await prisma.machine.update({
      data,
      where: {
        id,
      },
    })

    return machine
  }

  async deleteMachine(id: string): Promise<void> {
    await prisma.machine.delete({
      where: {
        id,
      },
    })
  }

  async findByMachine(id: string): Promise<Machine | null> {
    const machine = await prisma.machine.findUnique({
      where: {
        id,
      },
    })

    if (!machine) {
      return null
    }

    return machine
  }

  async findBySomeMachineName(name: string): Promise<Machine | null> {
    const machine = await prisma.machine.findUnique({
      where: {
        name,
      },
    })

    if (!machine) {
      return null
    }

    return machine
  }
}
