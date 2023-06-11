import { Express } from 'express'

import { registerUser } from './controllers/register-user'
import { getAllUsers } from './controllers/get-all-users'
import { getUser } from './controllers/get-user'

export function Routes(app: Express) {
  /* User routes */
  app.post('/user', registerUser)
  app.get('/users', getAllUsers)
  app.get('/user/:id', getUser)

  return app
}
