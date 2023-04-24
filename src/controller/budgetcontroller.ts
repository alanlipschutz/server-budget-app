import { NextFunction, Request, RequestHandler, Response } from 'express';
import { BudgetModel } from '../models/Budget';

export const getBudget: RequestHandler = async (req, res, next) => {
  try {
    const budget = await BudgetModel.getBudget();
    res.json(budget);
  } catch (error) {
    throw new Error('we had a problem returning the budget');
  }
};

export const getMyBudget = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userBudget = await BudgetModel.getMyBudget(req.userId!);
    return res.status(200).json(userBudget);
  } catch (error) {
    throw new Error("we can't send user's budget");
  }
};

export const addBudget: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    const budget = req.body.budget;
    if (userId) {
      const newBalance = await BudgetModel.addBudget(budget, userId);
      res.json({ newBalance: newBalance });
    }
  } catch (error) {
    throw new Error('something went wrong when adding budget');
  }
};

export const addExpense: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId;
    const expense = req.body;
    if (userId) {
      const newBudget = await BudgetModel.addExpense(expense, userId);
      res.json({ newBudget: newBudget });
    }
  } catch (error: any) {
    throw new Error(`we had a problem with this expense. ${error.message}`);
  }
};

export const removeExpense: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    if (userId) {
      const newBudget = await BudgetModel.removeExpense(id, userId);
      res.json({ newBudget: newBudget });
    }
  } catch (error) {
    throw new Error('we had a problem with this removal');
  }
};
