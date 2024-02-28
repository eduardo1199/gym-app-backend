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
import { verifyJWT } from './middleware/verifyJWT'

export function Routes(app: Express) {
  /** Plan routes */
  app.post('/plan', verifyJWT, RegisterPlan)
  app.get('/plan/:id', verifyJWT, GetPlan)
  app.get('/plans', verifyJWT, GetAllPlans)

  /* User routes */
  app.post('/user', verifyJWT, registerUser)
  app.get('/users', verifyJWT, getAllUsers)
  app.get('/user/:id', verifyJWT, getUser)
  app.put('/user/:id', verifyJWT, updateUser)
  app.delete('/user/:id', verifyJWT, deleteUser)
  app.post('/user/authentication', authenticateUser)

  /* Admin routes */

  app.get('/admin/:id', verifyJWT, getAdmin)
  app.post('/admin', verifyJWT, registerAdmin)
  app.post('/admin/authentication', authenticateAdmin)

  return app
}
