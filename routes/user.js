import express from 'express';
import { signup, login } from '../controllers/user.js';

const user = express.Router();

user.post('/signup', signup);
user.post('/login', login);

export default user;