import { Request, Response } from 'express'
import { ZodError } from 'zod'
import { env } from '../env'

export function zodErrorMiddleware(
  error: any,
  request: Request,
  response: Response,
  next: any,
) {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: 'Validation field error',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV === 'production') {
    // TODO: Here we should log to an external console tool like DataDog/NewRelic/Sentry
  } else {
    console.error(error.stack)
  }

  return response.status(500).send({
    message: 'Internal Server Error!',
  })
}
