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
    const {id} = req.params;

    let text = 'select * from expenses where user_id = $1 and id = $2';
    let values = [user_id, id];
    let query = await pool.query(text, values);

    // give response
    res.status(200).json(query.rows[0]);
}

const updateExpense = async (req, res) => {
    // get request
    const { user_id } = req;
    const {id} = req.params;
    const {amount, description} = req.body;

    let text = 'update expenses set amount = $3, description = $4 where user_id = $1 and id = $2';
    let values = [user_id, id, amount, description ];
    let query = await pool.query(text, values);

    text = 'select sum(amount) from expenses where user_id = $1';
    values = [user_id];
    query = await pool.query(text, values);
    let sum = query.rows[0].sum;

    // give response
    res.status(200).json({sum});
}

const postExpense = async (req, res) => {
    // get request
    const { user_id } = req;
    const { amount, description } = req.body;

    let text = 'insert into expenses values (default, $1, $2, $3) returning id';
    let values = [amount, user_id, description];
    let query = await pool.query(text, values);
    let id = query.rows[0].id

    text = 'select sum(amount) from expenses where user_id = $1';
    values = [user_id];
    query = await pool.query(text, values);
    let sum = query.rows[0].sum;

    const data = [{ id, amount, user_id, description }]
    // give response
    res.status(200).json({ data, sum });
}

// delete expense
const deleteExpense = async (req, res) => {
    try {
        const { user_id } = req;
        const { id } = req.params

        const text = 'delete from expenses where user_id = $1 and id = $2';
        const values = [user_id, id];
        const query = await pool.query(text, values);

        let sum;
        if (query.rowCount === 1) {
            let text = 'select sum(amount) from expenses where user_id = $1';
            let values = [user_id];
            let query = await pool.query(text, values);
            sum = query.rows[0].sum;
        }
        return res.status(200).json({ sum });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getExpenses, getExpense, postExpense, deleteExpense, updateExpense };
