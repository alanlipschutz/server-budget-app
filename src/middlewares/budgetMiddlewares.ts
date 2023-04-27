import { RequestHandler } from 'express';
import fs from 'fs';
import { BudgetState, Expense } from '../bugetType';
import { BudgetModel } from '../models/Budget';

const checkPositiveBudget: RequestHandler = async (req, res, next) => {
  const budget = req.body.budget;
  if (budget <= 0) {
    return res.status(400).json({
      message: 'budget should be a positive number',
    });
  }
  next();
};

const checkBudgetStatusPositive: RequestHandler = async (req, res, next) => {
  const myBudget: BudgetState = await BudgetModel.getMyBudget(req.userId!);
  if (myBudget.budgetState <= 0) {
    return res.status(400).json({
      message: 'Please, add budget to add more expenses',
    });
  }
  next();
};

const checkPositiveExpense: RequestHandler = async (req, res, next) => {
  const expense: Expense = req.body;
  if (expense.cost <= 0) {
    return res.status(400).json({
      error:
        'The cost of the expense is 0, please provide a positive number for the cost',
    });
  }
  next();
};

const checkPositiveRemaining: RequestHandler = async (req, res, next) => {
  const expense: Expense = req.body;
  const myBudget = await BudgetModel.getMyBudget(req.userId!)
  if (myBudget.remaining - expense.cost < 0) {
    return res.status(400).json({
      message:
        "with this expense you will be in a negative number. Please, don't do it or provide of more budget to continue",
    });
  }
  next();
};

const checkExpenseExist: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  const { id } = req.params;
  const userId = req.userId;
  if (userId) {
    const myBudget: BudgetState = await BudgetModel.getMyBudget(userId);
    const expenseToRemove = myBudget.expenses.find(
      (expense) => expense.id === id
    );
    if (!expenseToRemove) {
      return res.status(404).json({
        message: 'Expense not found. Please, provide of an expense to delete.',
      });
    }
  }
  next();
};

export default {
  checkPositiveBudget,
  checkBudgetStatusPositive,
  checkPositiveExpense,
  checkPositiveRemaining,
  checkExpenseExist,
};
