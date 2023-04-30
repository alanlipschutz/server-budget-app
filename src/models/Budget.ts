import { BudgetState, Expense } from '../bugetType';
import { getDb } from '../connection/connect';

export const BudgetModel = {
  getBudget,
  addExpense,
  removeExpense,
  addBudget,
  getMyBudget,
};

const db = getDb();

async function getBudget() {
  const collection = (await db).collection<BudgetState[]>('budgets');
  const budgets = await collection.find({}).toArray();
  return budgets;
}

async function getMyBudget(id: string) {
  const collection = (await db).collection<BudgetState[]>('budgets');
  const userBudget = await collection.findOne({ userId: id });
  if (!userBudget) {
    throw new Error('Budget not found');
  }
  return userBudget as unknown as BudgetState;
}

async function addBudget(budget: number, userId: string) {
  const collection = (await db).collection<BudgetState>('budgets');
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
  const collection = (await db).collection<BudgetState>('budgets');
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
  const collection = (await db).collection<BudgetState>('budgets');
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
