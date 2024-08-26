import express from 'express';
import { deleteExpense, getExpenses, postExpenses, getExpense, updateExpense } from '../controllers/expenses.js';
import requireAuth from '../middleware/requireAuth.js';

const expenses = express.Router();

// protect routes
expenses.use(requireAuth);

// Get Expenses
expenses.get('/', getExpenses);

// Get Single Expense
expenses.get('/:id', getExpense);

// Edit Expense
expenses.patch('/:id', updateExpense);

// Post Expense
expenses.post('/expenses', postExpenses);

// Delete Expense
expenses.delete('/:id', deleteExpense);

export default expenses;