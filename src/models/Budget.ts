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

async function getMyBudget(id: string) {
  const response = await fs.promises.readFile('src/data/budget.json', 'utf-8');
  const budget: BudgetState[] = JSON.parse(response);
  const userBudget = budget.filter((b) => b.userId === id);
  return userBudget;
}

async function addBudget(budget: number) {
  const oldBudget: BudgetState = await getBudget();
  oldBudget.budgetState += budget;
  oldBudget.remaining += budget;
  await fs.promises.writeFile(
    'src/data/budget.json',
    JSON.stringify(oldBudget)
  );
  return oldBudget;
}

async function addExpense(expense: Expense) {
  try {
    const budget: BudgetState = await getBudget();
    budget.expenses.push(expense);
    budget.spent += expense.cost;
    budget.remaining -= expense.cost;
    await fs.promises.writeFile('src/data/budget.json', JSON.stringify(budget));
    return budget;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

async function removeExpense(id: string) {
  const budget: BudgetState = await getBudget();
  const index = budget.expenses.findIndex((expense) => expense.id === id);
  const budgetToRemove = budget.expenses.find((expense) => expense.id === id);
  if (budgetToRemove) {
    budget.spent -= budgetToRemove.cost;
    budget.remaining += budgetToRemove.cost;
  }
  budget.expenses.splice(index, 1);
  await fs.promises.writeFile('src/data/budget.json', JSON.stringify(budget));
  const newBudget: BudgetState = await getBudget();
  return newBudget;
}
