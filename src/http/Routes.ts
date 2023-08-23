import { Express } from 'express'

import { registerUser } from './controllers/register-user'
import { getAllUsers } from './controllers/get-all-users'
import { getUser } from './controllers/get-user'
import { updateUser } from './controllers/update-users'
import { deleteUser } from './controllers/remove-users'
import { authenticateUser } from './controllers/authentication-user'

export function Routes(app: Express) {
  /* User routes */
  app.post('/user', registerUser)
  app.get('/users', getAllUsers)
  app.get('/user/:id', getUser)
  app.put('/user/:id', updateUser)
  app.delete('/user/:id', deleteUser)
  app.get('/user/:cpf', authenticateUser)

  return app
}
