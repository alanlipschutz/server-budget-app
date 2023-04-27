import fs from 'fs';
import { BudgetState, Expense } from '../bugetType';

export const BudgetModel = {
  getBudget,
  addExpense,
  removeExpense,
  addBudget,
  getMyBudget,
};

async function getBudget() {
  const response = await fs.promises.readFile('src/data/budget.json', 'utf-8');
  const budget = JSON.parse(response);
  return budget;
}

async function getMyBudget(id: string): Promise<BudgetState> {
  const response = await fs.promises.readFile('src/data/budget.json', 'utf-8');
  const budget: BudgetState[] = JSON.parse(response);
  let userBudget = budget.find((b) => b.userId === id);
  if (!userBudget) {
    userBudget = {
      budgetState: 0,
      expenses: [],
      remaining: 0,
      spent: 0,
      userId: id,
    };
    budget.push(userBudget);
  }
  return userBudget;
}

async function addBudget(budget: number, userId: string): Promise<BudgetState> {
  const budgets: BudgetState[] = await getBudget();
  let userBudget = budgets.find((budget) => budget.userId === userId);
  if (userBudget) {
    userBudget.budgetState += budget;
    userBudget.remaining += budget;
  } else {
    userBudget = {
      budgetState: budget,
      remaining: budget,
      expenses: [],
      spent: 0,
      userId: userId,
    };
    budgets.push(userBudget);
  }
  await fs.promises.writeFile('src/data/budget.json', JSON.stringify(budgets));
  return userBudget;
}

async function addExpense(expense: Expense, userId: string) {
  try {
    const budget: BudgetState = await getMyBudget(userId);
    budget.expenses.push(expense);
    budget.spent += expense.cost;
    budget.remaining -= expense.cost;
    const budgets: BudgetState[] = await getBudget();
    const index = budgets.findIndex((expense) => (expense.userId = userId));
    budgets.splice(index, 1, budget);
    await fs.promises.writeFile(
      'src/data/budget.json',
      JSON.stringify(budgets)
    );
    return budget;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function removeExpense(id: string, userId: string) {
  const budget: BudgetState = await getMyBudget(userId);
  console.log(budget);

  const index = budget.expenses.findIndex((expense) => expense.id === id);
  const budgetToRemove = budget.expenses.find((expense) => expense.id === id);
  if (budgetToRemove) {
    budget.spent -= budgetToRemove.cost;
    budget.remaining += budgetToRemove.cost;
  }
  budget.expenses.splice(index, 1);
  const budgets: BudgetState[] = await getBudget();
  const indexInBudgets = budgets.findIndex(
    (budget) => (budget.userId = userId)
  );
  budgets.splice(indexInBudgets, 1, budget);
  await fs.promises.writeFile('src/data/budget.json', JSON.stringify(budgets));
  return budget;
}
