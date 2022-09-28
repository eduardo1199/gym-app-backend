import express from 'express';

const app = express();

app.get('/users', (req, res) => {
  return res.status(200).json([]);
});

app.listen(3333);
