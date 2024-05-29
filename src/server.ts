import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'

import { env } from './env'

import { admin } from './http/admin-routes'
import { machines } from './http/machines-routes'
import { users } from './http/users-routes'
import { plans } from './http/plans-routes'

const app = express()

app.use(express.json())
app.use(cors())

app.use('/admin', admin)
app.use('/machines', machines)
app.use('/users', users)
app.use('/plans', plans)

app.listen(env.PORT)
