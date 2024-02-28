import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { env } from '../../env'

export async function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).send({
      message: 'No token provided.',
      auth: false,
    })
  }

  jwt.verify(token, env.SECRET, (error, decoded) => {
    if (error) {
      return res.status(500).send({
        message: 'Failed to authenticate token.',
        auth: false,
      })
    }

    next()
  })
}
