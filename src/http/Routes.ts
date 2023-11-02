import { Express } from 'express'

import { registerUser } from './controllers/register-user'
import { getAllUsers } from './controllers/get-all-users'
import { getUser } from './controllers/get-user'
import { updateUser } from './controllers/update-users'
import { deleteUser } from './controllers/remove-users'
import { authenticateUser } from './controllers/authentication-user'
import { getAdmin } from './controllers/get-admin'
import { registerAdmin } from './controllers/register-admin'
import { authenticateAdmin } from './controllers/authentication-admin'
import RegisterPlan from './controllers/register-plan'
import GetPlan from './controllers/get-plan'
import GetAllPlans from './controllers/get-all-plans'

export function Routes(app: Express) {
  /** Plan routes */
  app.post('/plan', RegisterPlan)
  app.get('/plan/:id', GetPlan)
  app.get('/plans', GetAllPlans)

  /* User routes */
  app.post('/user', registerUser)
  app.get('/users', getAllUsers)
  app.get('/user/:id', getUser)
  app.put('/user/:id', updateUser)
  app.delete('/user/:id', deleteUser)
  app.get('/user/:cpf', authenticateUser)

  /* Admin routes */

  app.get('/admin/:id', getAdmin)
  app.post('/admin', registerAdmin)
  app.post('/admin/authentication', authenticateAdmin)

  return app
}
