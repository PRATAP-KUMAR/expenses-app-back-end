import express from 'express';
import { deleteContact, getContacts, postContact, getContact, updateContact } from '../controllers/contacts.js';
import requireAuth from '../middleware/requireAuth.js';

const contacts = express.Router();

// protect routes
contacts.use(requireAuth);

// Get Expenses
contacts.get('/', getContacts);

// Get Single Expense
contacts.get('/:id', getContact);

// Edit Expense
contacts.patch('/:id', updateContact);

// Post Expense
contacts.post('/', postContact);

// Delete Expense
contacts.delete('/:id', deleteContact);

export default contacts;