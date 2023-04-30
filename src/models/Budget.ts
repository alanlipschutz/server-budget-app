import { ObjectId } from 'mongodb';
import { BudgetState, Expense } from '../bugetType';
import { connectedDb } from '../connection/connect';

export const BudgetModel = {
  getBudget,
  addExpense,
  removeExpense,
  addBudget,
  getMyBudget,
};

async function getBudget() {
  const db = await connectedDb();
  const collection = db.collection<BudgetState[]>('budgets');
  const budgets = await collection.find({}).toArray();
  return budgets;
}

async function getMyBudget(id: string) {
  try {
    const db = await connectedDb();
    const collection = db.collection('budgets');
    const userBudget = await collection.findOne({ userId: id });
    if (!userBudget) {
      const newBudget = {
        budgetState: 0,
        expenses: [],
        remaining: 0,
        spent: 0,
        userId: id,
      };
      await collection.insertOne(newBudget);
      return newBudget as BudgetState;
    }
    return userBudget as unknown as BudgetState;
  } catch (error) {
    console.log(error);

    throw new Error(`No budget. ${error}`);
  }
}

async function addBudget(budget: number, userId: string) {
  const db = await connectedDb();
  const collection = db.collection<BudgetState>('budgets');
  try {
    const userBudget = await collection.findOneAndUpdate(
      { userId: userId },
      {
        $inc: {
          budgetState: budget,
          remaining: budget,
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      }
    );
    return userBudget.value;
  } catch (error: any) {
    console.log(error.message);
  }
}

async function addExpense(expense: Expense, userId: string) {
  const db = await connectedDb();
  const collection = db.collection<BudgetState>('budgets');
  try {
    const userBudget = await collection.findOneAndUpdate(
      { userId: userId },
      {
        $inc: {
          spent: expense.cost,
          remaining: -expense.cost,
        },
        $push: {
          expenses: expense,
        },
      },
      {
        upsert: false,
        returnDocument: 'after',
      }
    );
    return userBudget.value;
  } catch (error: any) {
    console.log(error.message);
  }
}

async function removeExpense(id: string, userId: string) {
  const db = await connectedDb();
  const collection = db.collection<BudgetState>('budgets');
  try {
    const budget = await collection.findOne({ userId: userId });
    if (!budget) {
      throw new Error('Budget not found');
    }
    const expenseIndex = budget.expenses.findIndex(
      (expense) => expense.id === id
    );
    const expenseToDelete = budget.expenses[expenseIndex];
    const update = await collection.findOneAndUpdate(
      { userId: userId },
      {
        $inc: {
          spent: -expenseToDelete.cost,
          remaining: expenseToDelete.cost,
        },
        $pull: { expenses: { id: id } },
      },
      { returnDocument: 'after' }
    );
    return update.value;
  } catch (error: any) {
    console.log(error.message);
  }
}
