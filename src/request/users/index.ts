import { Request, Response } from 'express'
import { add, compareAsc, formatDistance, subDays } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { z } from 'zod'

import { prisma } from '../../prismaClient'
import {
  AuthenticationUserBodySchema,
  ParamsIdRequestSchema,
  UserEditSchema,
  UserSchema,
} from '../../schemas/user'
import { StatusCodeErrors } from '../../err/status.code-errors'

export async function createdUser(request: Request, response: Response) {
  try {
    const { age, cpf, name, planId, weight, startDateForPlan } =
      UserSchema.parse(request.body)

    const getUserExist = await prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (getUserExist)
      return response
        .status(StatusCodeErrors.BAD_REQUEST)
        .json({ message: 'Usuário já existe.' })

    const plan = await prisma.plan.findFirstOrThrow({
      where: {
        id: planId,
      },
    })

    const initialDateToPlan = startDateForPlan
      ? new Date(startDateForPlan)
      : new Date()

    const parseEndDateToPlan = add(initialDateToPlan, {
      days: plan.timeOfPlan,
    })

    const userData = {
      age,
      cpf,
      name,
      weight,
      startDateForPlan: initialDateToPlan,
      endDateforPlan: parseEndDateToPlan,
      planId,
    }

    await prisma.user.create({
      data: {
        ...userData,
      },
    })

    return response
      .status(StatusCodeErrors.CREATED)
      .send('Aluno cadastrado com sucesso!')
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
    } else {
      return response.status(StatusCodeErrors.INTERNAL_SERVER_ERROR).json(error)
    }
  }
}

export async function getAllUsers(request: Request, response: Response) {
  try {
    const users = await prisma.user.findMany()

    const serializeUsers = users.map((user) => {
      const isActive = compareAsc(user.endDateforPlan, user.startDateForPlan)

      return {
        ...user,
        isActive: isActive !== -1,
      }
    })

    return response.status(StatusCodeErrors.SUCCESS).json(serializeUsers)
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
    } else {
      return response.status(StatusCodeErrors.INTERNAL_SERVER_ERROR).json(error)
    }
  }
}

export async function getUser(request: Request, response: Response) {
  try {
    const { id } = ParamsIdRequestSchema.parse(request.params)

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user?.id)
      return response
        .status(StatusCodeErrors.NOT_FOUND)
        .json({ message: 'Usuário não existe!' })

    const isActive = compareAsc(user.endDateforPlan, user.startDateForPlan)

    const userResponse = {
      ...user,
      isActive: isActive !== -1,
      timeFinishPlan: formatDistance(
        user.startDateForPlan,
        user.endDateforPlan,
        {
          locale: ptBR,
        },
      ),
    }

    return response.status(StatusCodeErrors.SUCCESS).json(userResponse)
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
    } else {
      return response.status(StatusCodeErrors.INTERNAL_SERVER_ERROR).json(error)
    }
  }
}

export async function authenticationUser(request: Request, response: Response) {
  try {
    const { cpf } = AuthenticationUserBodySchema.parse(request.body)

    const user = await prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (user)
      return response.status(StatusCodeErrors.SUCCESS).json({ id: user.id })

    return response
      .status(StatusCodeErrors.NOT_FOUND)
      .json({ message: 'Não foi encontrado usuário com essa informação!' })
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
    } else {
      return response.status(StatusCodeErrors.INTERNAL_SERVER_ERROR).json(error)
    }
  }
}

export async function deleteUser(request: Request, response: Response) {
  try {
    const { id } = ParamsIdRequestSchema.parse(request.params)

    await prisma.user.delete({
      where: {
        id,
      },
    })

    return response
      .status(200)
      .json({ message: 'Usuário excluido com sucesso!' })
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
    } else {
      return response
        .status(StatusCodeErrors.INTERNAL_SERVER_ERROR)
        .json({ error })
    }
  }
}

export async function updateUser(request: Request, response: Response) {
  try {
    const { id } = ParamsIdRequestSchema.parse(request.params)

    const { planId, startDateForPlan, age, cpf, name, weight } =
      UserEditSchema.parse(request.body)

    let plan
    let endDateforPlan

    if (planId) {
      plan = await prisma.plan.findUnique({
        where: {
          id: planId,
        },
      })
    }

    if (startDateForPlan) {
      endDateforPlan = add(new Date(startDateForPlan), {
        days: plan?.timeOfPlan ?? 0,
      })
    } else {
      endDateforPlan = add(new Date(), {
        days: plan?.timeOfPlan ?? 0,
      })
    }

    if (!plan) {
      endDateforPlan = subDays(new Date(), 1)
    }

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        age,
        cpf,
        planId: plan?.id ?? null,
        startDateForPlan,
        endDateforPlan,
        weight,
      },
    })

    return response
      .status(StatusCodeErrors.CREATED)
      .json({ message: 'Aluno atualizado com sucesso!' })
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
    } else {
      return response
        .status(StatusCodeErrors.INTERNAL_SERVER_ERROR)
        .json({ message: error })
    }
  }
}
