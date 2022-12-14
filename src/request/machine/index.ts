import { Request, Response } from 'express';

import { z } from 'zod';

import { prisma } from '../../prismaClient';
import { MachineSchema, MachineSchemaType } from '../../schema/machine';

export async function createdMachine(request: Request, response: Response) {
  const machineData: MachineSchemaType = request.body;

  try {
    const parsedMachine = MachineSchema.parse(machineData);

    const machines = await prisma.machine.findMany();

    const existMachineName =  machines.some((machine) => machine.name === parsedMachine.name); 

    if(existMachineName) return response.status(401).json({ message: 'Já existe máquina com esse nome!' });

    const machine = await prisma.machine.create({
      data: parsedMachine
    });

    return response.status(201).json(machine);
  } catch (error) {
    if(error instanceof z.ZodError) {
      const errorsZodResponse = error.issues.map((issue) => {
        return {
          message: issue.message,
          path: issue.path[0]
        }
      });

      return response.status(401).json(errorsZodResponse);
    }
    return response.status(500).json({ message: 'Erro ao cadastrar máquina!' });
  }
}

export async function updateMachine(request: Request, response: Response) {
  const machineData = request.body;
  const machineId = request.params.id;

  try {
    const machine = await prisma.machine.update({
      where: {
        id: machineId
      },
      data: {
        description: machineData.description,
        maintenance: machineData.maintenance,
        name: machineData.name
      }
    });

    return response.status(200).json(machine);
  } catch (err) {
    return response.status(500).json({ message: 'Erro ao atualizar máquina!' });
  }
}

export async function deleteMachine(request: Request, response: Response) {
  const machineId = request.params.id;

  try {
    const machine = await prisma.machine.delete({
      where: {
        id: machineId
      },
    });

    return response.status(200).json(machine);
  } catch (err) {
    return response.status(500).json({ message: 'Erro ao excluir máquina!' });
  }
}

export async function getAllMachines(request: Request, response: Response) {
  try {
    const machine = await prisma.machine.findMany();

    return response.status(200).json(machine);
  } catch (err) {
    return response.status(500).json({ message: 'Erro ao buscar máquinas!' });
  }
}

