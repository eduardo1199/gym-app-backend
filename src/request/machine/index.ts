import { Request, Response } from 'express'

import { z } from 'zod'
import { StatusCodeErrors } from '../../err/status.code-errors'

import { prisma } from '../../prismaClient'
import {
  MachineRequestCreatedSchema,
  MachineRequestUpdateSchema,
  MachineIdSchema,
} from '../../schemas/machine'

export async function createdMachine(request: Request, response: Response) {
  try {
    const { name, description, maintenance } =
      MachineRequestCreatedSchema.parse(request.body)

    const machines = await prisma.machine.findMany()

    const existMachineName = machines.some((machine) => machine.name === name)

    if (existMachineName)
      return response
        .status(StatusCodeErrors.BAD_REQUEST)
        .json({ message: 'Já existe máquina com esse nome!' })

    const machine = await prisma.machine.create({
      data: {
        description,
        maintenance,
        name,
      },
    })

    return response.status(StatusCodeErrors.CREATED).json(machine)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorsZodResponse = error.issues.map((issue) => {
        return {
          message: issue.message,
          path: issue.path[0],
        }
      })

      return response
        .status(StatusCodeErrors.BAD_REQUEST)
        .json(errorsZodResponse)
    }
    return response
      .status(StatusCodeErrors.INTERNAL_SERVER_ERROR)
      .json({ message: 'Erro ao cadastrar máquina!' })
  }
}

export async function updateMachine(request: Request, response: Response) {
  try {
    const { description, maintenance, name } = MachineRequestUpdateSchema.parse(
      request.body,
    )

    const { id } = MachineIdSchema.parse(request.params)

    const machine = await prisma.machine.update({
      where: {
        id,
      },
      data: {
        description,
        maintenance,
        name,
      },
    })

    return response.status(StatusCodeErrors.SUCCESS).json(machine)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorsZodResponse = error.issues.map((issue) => {
        return {
          message: issue.message,
          path: issue.path[0],
        }
      })

      return response
        .status(StatusCodeErrors.BAD_REQUEST)
        .json(errorsZodResponse)
    }

    return response
      .status(StatusCodeErrors.INTERNAL_SERVER_ERROR)
      .json({ message: 'Erro ao atualizar máquina!' })
  }
}

export async function deleteMachine(request: Request, response: Response) {
  try {
    const { id } = MachineIdSchema.parse(request.params)

    const machine = await prisma.machine.delete({
      where: {
        id,
      },
    })

    return response.status(200).json(machine)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorsZodResponse = error.issues.map((issue) => {
        return {
          message: issue.message,
          path: issue.path[0],
        }
      })

      return response
        .status(StatusCodeErrors.BAD_REQUEST)
        .json(errorsZodResponse)
    }

    return response
      .status(StatusCodeErrors.BAD_REQUEST)
      .json({ message: 'Erro ao excluir máquina!' })
  }
}

export async function getAllMachines(request: Request, response: Response) {
  try {
    const machine = await prisma.machine.findMany()

    return response.status(StatusCodeErrors.SUCCESS).json(machine)
  } catch (err) {
    return response
      .status(StatusCodeErrors.BAD_REQUEST)
      .json({ message: 'Erro ao buscar máquinas!' })
  }
}
