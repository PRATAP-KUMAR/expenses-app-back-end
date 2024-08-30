import pool from "../db.js";

const getContacts = async (req, res) => {
    // get request
    const { user_id } = req;

    let text = 'select * from contacts where user_id = $1 order by id desc';
    let values = [user_id];
    let query = await pool.query(text, values);

    // give response
    res.status(200).json(query.rows);
}

const getContact = async (req, res) => {
    // get request
    const { user_id } = req;
    const { id } = req.params;

    let text = 'select * from contacts where user_id = $1 and id = $2';
    let values = [user_id, id];
    let query = await pool.query(text, values);

    // give response
    res.status(200).json(query.rows[0]);
}

const updateContact = async (req, res) => {
    // get request
    const { user_id } = req;
    const { id } = req.params;
    const { name, phone } = req.body;

    let text = 'update contacts set name = $3, phone = $4, updated_at = current_timestamp where user_id = $1 and id = $2';
    let values = [user_id, id, name, phone];
    let query = await pool.query(text, values);
    if (query.rowCount === 1) {
        // give response
        res.status(200).json({ name, phone, id });
    }
}

const postContact = async (req, res) => {
    // get request
    try {

        const { user_id } = req;
        const { name, phone } = req.body;

        let text = 'insert into contacts values (default, $1, $2, $3) returning id';
        let values = [name, phone, user_id];
        let query = await pool.query(text, values);
        let id = query.rows[0].id

        const data = { id, name, phone, user_id }
        // give response
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

// delete expense
const deleteContact = async (req, res) => {
    try {
        const { user_id } = req;
        const { id } = req.params

        let text, values, query;

        text = 'delete from contacts where user_id = $1 and id = $2 returning *';
        values = [user_id, id];
        query = await pool.query(text, values);
        let deletedRow = query.rows[0];
        const { name, phone, created_at, updated_at } = deletedRow;

        try {
            text = 'insert into deleted_contacts values ($1, $2, $3, $4, $5, $6, default)';
            values = [id, name, phone, user_id, created_at, updated_at];
            query = await pool.query(text, values);
        } catch (e) {
            console.log(e);
        }

        res.status(200).json({ id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getContacts, getContact, postContact, deleteContact, updateContact };
