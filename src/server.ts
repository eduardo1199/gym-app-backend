import express from 'express';
import { getActualDateAndHours } from './utils';

const app = express();

app.use(express.json());

app.get('/admin', (req, res) => {
  
});

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
