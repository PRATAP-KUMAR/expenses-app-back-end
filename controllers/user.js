import pool from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: '2d' });
}

const signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            throw Error('both email and password cannot be empty');
        }

        let text, values, query;

        text = 'select email from users where email = $1';
        values = [email];
        query = await pool.query(text, values);

        if (query.rowCount === 0) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            text = 'insert into users values(default, $1, $2, default) returning user_id';
            values = [email, hash];
            query = await pool.query(text, values);

            const user_id = query.rows[0].user_id;
            const token = createToken(user_id);

            res.status(201).json({ email, token, user_id });
        } else {
            throw Error('email already in use');
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    let text;
    let values;
    let query;

    try {
        if (!email || !password) {
            throw new Error('both user name password must be provided');
        }

        text = 'select user_id, password from users where email = $1';
        values = [email];
        query = await pool.query(text, values);

        const user_id = query.rows[0]?.user_id || null;

        if (!user_id) {
            throw new Error(`${email} is not registered`);
        }

        const match = await bcrypt.compare(password, query.rows[0].password);

        if (!match) {
            throw new Error('Incorrect password');
        }

        const token = createToken(user_id);

        res.status(200).json({ email, token });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ "error": error.message});
    }
}

export { signup, login }