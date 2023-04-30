import express from 'express';
import cors from 'cors';

import budgetRoutes from './routes/budgetRoute';
import userRoutes from './routes/usersRoute';
import cookieParser from 'cookie-parser';
import { run } from './connection/connect';

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: ['http://localhost:3000', '*'],
  methods: 'GET,PUT,POST,DELETE',
  credentials: true,
  allowedHeaders:
    'Content-Type, Authorization, Content-Length, X-Requested-With',
};
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(express.json());
app.use('/', budgetRoutes);
app.use('/', userRoutes);

// start the server
app.listen(8080, async () => {
  await run().catch(console.dir);
  console.log(`server running : http://localhost:8080`);
});
