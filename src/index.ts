import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';

import budgetRoutes from './routes/budgetRoute';

const app = express();
// app.use(cors({ origin: 'http://localhost:3000' }));

app.use(json());
app.use('/', budgetRoutes);

// start the server
app.listen(8080, () => {
  console.log(`server running : http://localhost:8080`);
});
