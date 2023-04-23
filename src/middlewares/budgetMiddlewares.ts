import { RequestHandler } from 'express';
import fs from 'fs';
import { BudgetState, Expense } from '../bugetType';

const checkPositiveBudget: RequestHandler = async (req, res, next) => {
  const budget = req.body.budget;
  if (budget <= 0) {
    res.status(400).send({ error: 'budget should be a positive number' });
  }
  next();
};

const checkBudgetStatusPositive: RequestHandler = async (req, res, next) => {
  const response = await fs.promises.readFile('src/data/budget.json', 'utf-8');
  const budgetState: BudgetState = JSON.parse(response);
  if (budgetState.budgetState <= 0) {
    res.status(400).send({ error: 'Please, add budget to add more expenses' });
  }
  next();
};

const checkPositiveExpense: RequestHandler = async (req, res, next) => {
  const expense: Expense = req.body;
  if (expense.cost <= 0) {
    res.status(400).send({
      error:
        'The cost of the expense is 0, please provide a positive number for the cost',
    });
  }
  next();
};

const checkPositiveRemaining: RequestHandler = async (req, res, next) => {
  const expense: Expense = req.body;
  const response = await fs.promises.readFile('src/data/budget.json', 'utf-8');
  const budgetState: BudgetState = JSON.parse(response);
  if (budgetState.budgetState - expense.cost < 0) {
    res.status(400).send({
      error:
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
  const response = await fs.promises.readFile('src/data/budget.json', 'utf-8');
  const budgetState: BudgetState = JSON.parse(response);
  const expenseToRemove = budgetState.expenses.find(
    (expense) => expense.id === id
  );
  if (!expenseToRemove) {
    res.status(404).send({
      error: 'Expense not found. Please, provide of an expense to delete.',
    });
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
