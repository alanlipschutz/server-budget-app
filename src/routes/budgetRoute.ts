import express from 'express';
import {
  addExpense,
  getBudget,
  removeExpense,
  addBudget,
} from '../controller/budgetcontroller';
import budgetMiddlewares from '../middlewares/budgetMiddlewares';

const router = express.Router();

router.get('/', getBudget);
router.post('/budget', budgetMiddlewares.checkPositiveBudget, addBudget);
router.post(
  '/',
  budgetMiddlewares.checkBudgetStatusPositive,
  budgetMiddlewares.checkPositiveExpense,
  budgetMiddlewares.checkPositiveRemaining,
  addExpense
);
router.delete('/:id', budgetMiddlewares.checkExpenseExist, removeExpense);

export default router;
