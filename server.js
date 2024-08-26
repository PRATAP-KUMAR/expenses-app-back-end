import express from 'express';
import pool from './db.js';
import expenses from './routes/expenses.js';
import user from './routes/user.js';
import dotenv from "dotenv";
import cors from "cors";

// Express App
const app = express();

//middle ware
dotenv.config();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'https://pratap-panabaka-expenses-app.netlify.app'],
}));

// user signup & login
app.use('/api/user', user);

// expenses
app.use('/api', expenses);

// check if pool credentials are correct and then only listen for requests
let connected, database;

try {
    const client = await pool.connect();
    connected = client._connected;
    database = client.database;
    client.release();
} catch (error) {
    console.log(error);
}

if (connected) {
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`conncted to database "${database}" and listening on port ${PORT}`);
    });
}
