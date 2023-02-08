import express from 'express';
import cors from 'cors';

import { createdAdmin, getAuthenticationAdmin, getAdmin } from './request/admin';
import { createdPlan, getPlan, getPlans, deletePlan, updatePlan } from './request/plan';
import { createdUser, deleteUser, getAllUsers, getUser, updateUser, authenticationUser } from './request/users';
import { createdMachine, deleteMachine, getAllMachines, updateMachine } from './request/machine';

const app = express();

app.use(express.json());
app.use(cors());

app.post('/admin', createdAdmin);
app.post('/admin/authentication', getAuthenticationAdmin);
app.get('/admin/:id', getAdmin);

app.post('/plan', createdPlan);
app.get('/plan/:id', getPlan);
app.get('/plans', getPlans);
app.put('/plan/:id', updatePlan);
app.delete('/plan/:id', deletePlan);

app.post('/user', createdUser);
app.get('/users', getAllUsers);
app.get('/user/:id', getUser);
app.delete('/user/:id', deleteUser);
app.put('/user/:id', updateUser);
app.post('/user/authentication', authenticationUser);


app.post('/machine', createdMachine);
app.put('/machine/:id', updateMachine);
app.delete('/machine/:id', deleteMachine);
app.get('/machines', getAllMachines);

app.listen(3434);
