import express from 'express'
import { verifyJWT } from './middleware/verifyJWT'
import GetAllPlans from './controllers/get-all-plans'
import GetPlan from './controllers/get-plan'
import RegisterPlan from './controllers/register-plan'
import { deletePlanController } from './controllers/delete-plan'
import { updatePlanController } from './controllers/update-plan'

export const plans = express()

plans.use(verifyJWT)

plans.post('/', RegisterPlan)
plans.get('/:id', GetPlan)
plans.get('/', GetAllPlans)
plans.delete('/:id', deletePlanController)
plans.put('/:id', updatePlanController)
