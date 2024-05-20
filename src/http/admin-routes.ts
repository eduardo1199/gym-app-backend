import express from 'express'
import { verifyJWT } from './middleware/verifyJWT'
import { getAdmin } from './controllers/get-admin'
import { registerAdmin } from './controllers/register-admin'
import { authenticateAdmin } from './controllers/authentication-admin'

export const admin = express()

admin.post('/', verifyJWT, registerAdmin)
admin.get('/:id', verifyJWT, getAdmin)
admin.post('/authentication', authenticateAdmin)
