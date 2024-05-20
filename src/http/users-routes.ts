import express from 'express'
import { verifyJWT } from './middleware/verifyJWT'
import { registerUser } from './controllers/register-user'
import { getAllUsers } from './controllers/get-all-users'
import { getUser } from './controllers/get-user'
import { updateUser } from './controllers/update-users'
import { deleteUser } from './controllers/remove-users'
import { authenticateUser } from './controllers/authentication-user'

export const users = express()

users.post('/', verifyJWT, registerUser)
users.get('/', verifyJWT, getAllUsers)
users.get('/:id', getUser)
users.put('/:id', verifyJWT, updateUser)
users.delete('/:id', verifyJWT, deleteUser)
users.post('/authentication', authenticateUser)
