import express, { NextFunction } from 'express';
import {
  addExpense,
  getBudget,
  removeExpense,
  addBudget,
  getMyBudget,
} from '../controller/budgetcontroller';
import budgetMiddlewares from '../middlewares/budgetMiddlewares';
import userMiddlewares from '../middlewares/userMiddlewares';

const router = express.Router();

router.get('/', userMiddlewares.isAuth, getBudget);
router.get('/budget', userMiddlewares.isAuth, getMyBudget);
router.post(
  '/budget',
  userMiddlewares.isAuth,
  budgetMiddlewares.checkPositiveBudget,
  addBudget
);
router.post(
  '/',
  userMiddlewares.isAuth,
  budgetMiddlewares.checkBudgetStatusPositive,
  budgetMiddlewares.checkPositiveExpense,
  budgetMiddlewares.checkPositiveRemaining,
  addExpense
);
router.delete(
  '/:id',
  userMiddlewares.isAuth,
  budgetMiddlewares.checkExpenseExist,
  removeExpense
);

export default router;
