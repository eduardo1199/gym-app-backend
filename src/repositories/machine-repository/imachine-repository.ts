import { Machine, Prisma } from '@prisma/client'

export interface IMachineRepository {
  register(data: Prisma.MachineCreateInput): Promise<Machine>
  findByAllMachines(): Promise<Machine[]>
  updateMachine(data: Prisma.MachineUpdateInput, id: string): Promise<Machine>
  deleteMachine(id: string): Promise<void>
  findByMachine(id: string): Promise<Machine | null>
}
