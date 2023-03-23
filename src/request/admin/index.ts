import { Request, Response } from 'express'

import { z } from 'zod'
import { StatusCodeErrors } from '../../err/status.code-errors'

import { prisma } from '../../prismaClient'
import {
  AdminAuthenticationSchema,
  AdminIdSchema,
  AdminSchema,
} from '../../schemas/admin'

export async function createdAdmin(request: Request, response: Response) {
  try {
    const { birthDate, cpf, name, password, year } = AdminSchema.parse(
      request.body,
    )

    const getAdmin = await prisma.admin.findUnique({
      where: {
        cpf,
      },
    })

    if (getAdmin?.cpf)
      return response
        .status(StatusCodeErrors.UNAUTHORIZED)
        .json({ message: 'Usuário administrador já existe' })

    await prisma.admin.create({
      data: {
        birthDate,
        cpf,
        name,
        password,
        year,
      },
    })

    return response
      .status(StatusCodeErrors.CREATED)
      .send('Cadastro realizado com sucesso!')
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
      .send({ error })
  }
}

export async function getAuthenticationAdmin(
  request: Request,
  response: Response,
) {
  try {
    const { cpf, password } = AdminAuthenticationSchema.parse(request.body)

    const admin = await prisma.admin.findUnique({
      where: {
        cpf,
      },
    })

    if (!admin?.cpf) {
      return response
        .status(StatusCodeErrors.BAD_REQUEST)
        .json({ message: 'Usuário não existe no sistema!' })
    }

    if (admin?.password !== password)
      return response
        .status(StatusCodeErrors.BAD_REQUEST)
        .json({ message: 'Senha incorreta!' })

    return response.status(StatusCodeErrors.SUCCESS).json(admin.id)
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
      .json({ error })
  }
}

export async function getAdmin(request: Request, response: Response) {
  try {
    const { id } = AdminIdSchema.parse(request.params)

    const admin = await prisma.admin.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        name: true,
        year: true,
      },
    })

    return response.status(StatusCodeErrors.SUCCESS).json(admin)
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
      .json({ error })
  }
}
