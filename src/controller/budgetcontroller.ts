import { RequestHandler } from 'express';
import { Expense } from '../bugetType';
import { BudgetModel } from '../models/Budget';

export const getBudget: RequestHandler = async (req, res, next) => {
  try {
    const budget = await BudgetModel.getBudget();
    res.json(budget);
  } catch (error) {
    throw new Error('we had a problem returning the budget');
  }
};

export const addBudget: RequestHandler = async (req, res, next) => {
  try {
    const budget = req.body.budget;
    const newState = await BudgetModel.addBudget(budget);
    res.status(202).json({ newState });
  } catch (error) {
    throw new Error('something went wrong when adding budget');
  }
};

export const addExpense: RequestHandler = async (req, res, next) => {
  try {
    const expense = req.body;
    const newBudget = await BudgetModel.addExpense(expense);
    res.send(newBudget);
  } catch (error: any) {
    throw new Error(`we had a problem with this expense. ${error.message}`);
  }
};

export const removeExpense: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newBudget = await BudgetModel.removeExpense(id);
    res.status(204).send(newBudget);
  } catch (error) {
    throw new Error('we had a problem with this removal');
  }
};
