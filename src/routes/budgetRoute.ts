import express, { NextFunction } from 'express';
import {
  addExpense,
  getBudget,
  removeExpense,
  addBudget,
} from '../controller/budgetcontroller';
import budgetMiddlewares from '../middlewares/budgetMiddlewares';
import userMiddlewares from '../middlewares/userMiddlewares';

const router = express.Router();

router.get('/', userMiddlewares.isAuth, getBudget);
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
