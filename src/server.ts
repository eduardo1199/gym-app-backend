import express from 'express'
import cors from 'cors'

import { env } from './env'

import { Routes } from './http/Routes'

const appExpress = express()

appExpress.use(express.json())
appExpress.use(cors())

const app = Routes(appExpress)

app.listen(env.PORT)
