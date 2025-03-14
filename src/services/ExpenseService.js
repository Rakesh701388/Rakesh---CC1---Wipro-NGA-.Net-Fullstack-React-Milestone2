// src/services/ExpenseService.js

// Get all expenses from local storage
const getAllExpenses = () => {
  return JSON.parse(localStorage.getItem("expenses")) || [];
};

// Save expenses to local storage
const saveExpenses = (expenses) => {
  localStorage.setItem("expenses", JSON.stringify(expenses));
};

// Add new expense
const addExpense = (
  description,
  amount,
  payerId,
  participantIds,
  date = new Date().toISOString().split("T")[0]
) => {
  if (!description.trim()) {
    throw new Error("Description cannot be empty");
  }

  if (isNaN(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }

  if (!payerId) {
    throw new Error("Payer must be selected");
  }

  if (!participantIds || participantIds.length === 0) {
    throw new Error("At least one participant must be selected");
  }

  const expenses = getAllExpenses();
  const newExpense = {
    id: Date.now().toString(),
    description: description.trim(),
    amount: parseFloat(amount),
    payerId,
    participantIds,
    date,
  };

  expenses.push(newExpense);
  saveExpenses(expenses);
  return newExpense;
};

// Get expense by ID
const getExpenseById = (id) => {
  const expenses = getAllExpenses();
  return expenses.find((expense) => expense.id === id);
};

// Update expense
const updateExpense = (
  id,
  description,
  amount,
  payerId,
  participantIds,
  date
) => {
  if (!description.trim()) {
    throw new Error("Description cannot be empty");
  }

  if (isNaN(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }

  if (!payerId) {
    throw new Error("Payer must be selected");
  }

  if (!participantIds || participantIds.length === 0) {
    throw new Error("At least one participant must be selected");
  }

  const expenses = getAllExpenses();
  const expenseIndex = expenses.findIndex((expense) => expense.id === id);
  if (expenseIndex === -1) {
    throw new Error("Expense not found");
  }

  expenses[expenseIndex] = {
    ...expenses[expenseIndex],
    description: description.trim(),
    amount: parseFloat(amount),
    payerId,
    participantIds,
    date,
  };

  saveExpenses(expenses);
  return expenses[expenseIndex];
};

// Delete expense
const deleteExpense = (id) => {
  const expenses = getAllExpenses();
  const initialLength = expenses.length;
  const updatedExpenses = expenses.filter((expense) => expense.id !== id);

  if (initialLength === updatedExpenses.length) {
    throw new Error("Expense not found");
  }

  saveExpenses(updatedExpenses);
  return id;
};

// Get expenses by friend ID
const getExpensesByFriendId = (friendId) => {
  const expenses = getAllExpenses();
  return expenses.filter(
    (expense) =>
      expense.payerId === friendId || expense.participantIds.includes(friendId)
  );
};

// Handle friend deletion - remove friend from expenses or delete expenses
const handleFriendDeletion = (friendId) => {
  let expenses = getAllExpenses();

  // Update expenses that have the deleted friend as a participant
  expenses = expenses.map((expense) => {
    if (expense.participantIds.includes(friendId)) {
      return {
        ...expense,
        participantIds: expense.participantIds.filter((id) => id !== friendId),
      };
    }
    return expense;
  });

  // Remove expenses where the deleted friend was the only participant or was the payer
  expenses = expenses.filter(
    (expense) =>
      expense.payerId !== friendId && expense.participantIds.length > 0
  );

  saveExpenses(expenses);
};

const ExpenseService = {
  getAllExpenses,
  addExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpensesByFriendId,
  handleFriendDeletion,
};

export default ExpenseService;
