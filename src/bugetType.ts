export interface BudgetState {
  budgetState: number;
  remaining: number;
  spent: number;
  expenses: Expense[];
}

export type Expense = {
  id: string;
  name: string;
  cost: number;
};

export interface BudgetModel {
  readonly budget: BudgetState;
  getInformation: () => BudgetState;
  addExpense: (expense: Expense) => BudgetState;
  removeExpense: (id: string) => BudgetState;
}
