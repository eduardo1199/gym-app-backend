import express from 'express';
import cors from 'cors';

import { getActualDateAndHours } from './utils';
import { prisma } from './prismaClient';
import { createAdmin, getAdmin } from './request/admin';

const app = express();

app.use(express.json());
app.use(cors());

app.post('/admin', createAdmin);
app.get('/admin', getAdmin);

app.post('/user', (req, res) => {
  
});

app.get('/users', (req, res) => {
  const date = getActualDateAndHours();

  return res.status(200).json({
    date: date
  });
});

app.delete('/user', (req, res) => {
  
});

app.post('/plan', (req, res) => {
  
});

app.get('/plans', (req, res) => {
  
});

app.listen(3434);
