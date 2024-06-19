import express from 'express'
import { verifyJWT } from './middleware/verifyJWT'
import { registerMachine } from './controllers/register-machine'
import { updateMachine } from './controllers/update-machine'
import { getMachine } from './controllers/get-machine'
import { deleteMachine } from './controllers/delete-machine'
import { getAllMachines } from './controllers/get-all-machines'

export const machines = express()

machines.use(verifyJWT)

machines.post('/', registerMachine)
machines.put('/:id', updateMachine)
machines.get('/:id', getMachine)
machines.delete('/:id', deleteMachine)
machines.get('/', getAllMachines)
