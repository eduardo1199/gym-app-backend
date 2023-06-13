import express from 'express'
import cors from 'cors'

import { createdAdmin, getAuthenticationAdmin, getAdmin } from './request/admin'
import { env } from './env'

import { registerUser } from './http/controllers/register-user'
import { getAllUsers } from './http/controllers/get-all-users'
import { getUser } from './http/controllers/get-user'
import { Routes } from './http/Routes'

const appExpress = express()

appExpress.use(express.json())
appExpress.use(cors())

const app = Routes(appExpress)

app.listen(env.PORT)
