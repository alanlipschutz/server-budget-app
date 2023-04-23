import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';

import budgetRoutes from './routes/budgetRoute';
import userRoutes from './routes/usersRoute';

const app = express();
app.use(cors());

app.use(json());
app.use('/', budgetRoutes);
app.use('/', userRoutes);

// start the server
app.listen(8080, () => {
  console.log(`server running : http://localhost:8080`);
});
