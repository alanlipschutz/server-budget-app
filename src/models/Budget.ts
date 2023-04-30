import fs from 'fs';
import { BudgetState, Expense } from '../bugetType';
import { ObjectId, Collection } from 'mongodb';
import { connectToDB, client } from '../connection/connect';

export const BudgetModel = {
  getBudget,
  addExpense,
  removeExpense,
  addBudget,
  getMyBudget,
};

async function getBudget() {
  connectToDB();
  const collection = client.db().collection<BudgetState[]>('budgets');
  const budgets = await collection.find({}).toArray();
  return budgets;
}

async function getMyBudget(id: string) {
  connectToDB();
  const collection = client.db().collection<BudgetState[]>('budgets');
  const userBudget = await collection.findOne({ userId: id });
  if (!userBudget) {
    throw new Error('Budget not found');
  }
  return userBudget as unknown as BudgetState;
}

async function addBudget(budget: number, userId: string) {
  connectToDB();
  const collection = client.db().collection<BudgetState>('budgets');
  try {
    const userBudget = await collection.updateOne(
      { userId: userId },
      {
        $inc: {
          budgetState: budget,
          remaining: budget,
        },
      },
      {
        upsert: true,
      }
    );
    return userBudget;
  } catch (error: any) {
    console.log(error.message);
  }
}

async function addExpense(expense: Expense, userId: string) {
  connectToDB();
  const collection = client.db().collection<BudgetState>('budgets');
  try {
    const userBudget = await collection.updateOne(
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
      }
    );
    return userBudget;
  } catch (error: any) {
    console.log(error.message);
  }
}

async function removeExpense(id: string, userId: string) {
  connectToDB();
  const collection = client.db().collection<BudgetState>('budgets');
  try {
    const expense = await collection.findOne({ userId: userId });
    return expense;
  } catch (error) {}
  // const budget: BudgetState = await getMyBudget(userId);
  // console.log(budget);

  // const index = budget.expenses.findIndex((expense) => expense.id === id);
  // const budgetToRemove = budget.expenses.find((expense) => expense.id === id);
  // if (budgetToRemove) {
  //   budget.spent -= budgetToRemove.cost;
  //   budget.remaining += budgetToRemove.cost;
  // }
  // budget.expenses.splice(index, 1);
  // const budgets: BudgetState[] = await getBudget();
  // const indexInBudgets = budgets.findIndex(
  //   (budget) => (budget.userId = userId)
  // );
  // budgets.splice(indexInBudgets, 1, budget);
  // await fs.promises.writeFile('src/data/budget.json', JSON.stringify(budgets));
  // return budget;
}
