import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';

import budgetRoutes from './routes/budgetRoute';
import userRoutes from './routes/usersRoute';

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: ['http://localhost:3000', '*'],
  methods: 'GET,PUT,POST,DELETE',
  allowedHeaders:
    'Content-Type, Authorization, Content-Length, X-Requested-With',
};
app.use(cors(corsOptions));

app.use(express.json());
app.use('/', budgetRoutes);
app.use('/', userRoutes);

// start the server
app.listen(8080, () => {
  console.log(`server running : http://localhost:8080`);
});
