import pool from "../db.js";

const getExpenses = async (req, res) => {
    // get request
    const { user_id } = req;

    let text = 'select * from expenses where user_id = $1 order by id desc';
    let values = [user_id];
    let query = await pool.query(text, values);

    text = 'select sum(amount) from expenses where user_id = $1';
    let querySum = await pool.query(text, values);
    const sum = querySum.rows[0].sum;


    // give response
    res.status(200).json({ data: query.rows, sum });
}

const getExpense = async (req, res) => {
    // get request
    const { user_id } = req;
    const { id } = req.params;

    let text = 'select * from expenses where user_id = $1 and id = $2';
    let values = [user_id, id];
    let query = await pool.query(text, values);

    // give response
    res.status(200).json(query.rows[0]);
}

const updateExpense = async (req, res) => {
    // get request
    const { user_id } = req;
    const { id } = req.params;
    const { amount, description } = req.body;

    let text = 'update expenses set description = $3, amount = $4, updated_at = current_timestamp where user_id = $1 and id = $2';
    let values = [user_id, id, description, amount];
    let query = await pool.query(text, values);

    text = 'select sum(amount) from expenses where user_id = $1';
    values = [user_id];
    query = await pool.query(text, values);
    let sum = query.rows[0].sum;

    // give response
    res.status(200).json({ amount, description, id, sum });
}

const postExpense = async (req, res) => {
    // get request
    const { user_id } = req;
    const { amount, description } = req.body;

    let text = 'insert into expenses values (default, $1, $2, $3) returning id, created_at';
    let values = [description, amount, user_id];
    let query = await pool.query(text, values);
    let {id, created_at} = query.rows[0]

    text = 'select sum(amount) from expenses where user_id = $1';
    values = [user_id];
    query = await pool.query(text, values);
    let sum = query.rows[0].sum;

    const data = [{ id, description, amount, user_id, created_at }]
    // give response
    res.status(200).json({ data, sum });
}

// delete expense
const deleteExpense = async (req, res) => {
    try {
        const { user_id } = req;
        const { id } = req.params;

        let text, values, query;

        // delete
        text = 'delete from expenses where user_id = $1 and id = $2 returning *';
        values = [user_id, id];
        query = await pool.query(text, values);
        let deletedRow = query.rows[0]
        let { description, amount, created_at, updated_at } = deletedRow;

        // backup
        try {
            text = 'insert into deleted_expenses values ($1, $2, $3, $4, $5, $6, default)';
            values = [id, description, amount, user_id, created_at, updated_at]
            query = await pool.query(text, values);
        } catch (e) {
            console.log(e);
        }

        // update sum
        let sum;
        if (query.rowCount === 1) {
            text = 'select sum(amount) from expenses where user_id = $1';
            values = [user_id];
            query = await pool.query(text, values);
            sum = query.rows[0].sum;
        }
        return res.status(200).json({ id, sum });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getExpenses, getExpense, postExpense, deleteExpense, updateExpense };
