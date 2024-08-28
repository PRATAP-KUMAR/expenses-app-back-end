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
    const {id} = req.params;

    let text = 'select * from contacts where user_id = $1 and id = $2';
    let values = [user_id, id];
    let query = await pool.query(text, values);

    // give response
    res.status(200).json(query.rows[0]);
}

const updateContact = async (req, res) => {
    // get request
    const { user_id } = req;
    const {id} = req.params;
    const {name, phone} = req.body;

    let text = 'update contacts set name = $3, phone = $4 where user_id = $1 and id = $2';
    let values = [user_id, id, name, phone ];
    let query = await pool.query(text, values);

    // give response
    res.status(200).json({message: 'contact updated successfully'});
}

const postContact = async (req, res) => {
    // get request
    const { user_id } = req;
    const { name, phone } = req.body;

    let text = 'insert into contacts values (default, $1, $2, $3) returning id';
    let values = [name, phone, user_id];
    let query = await pool.query(text, values);
    let id = query.rows[0].id

    const data = { id, name, phone, user_id }
    // give response
    res.status(200).json(data);
}

// delete expense
const deleteContact = async (req, res) => {
    try {
        const { user_id } = req;
        const { id } = req.params

        const text = 'delete from contacts where user_id = $1 and id = $2';
        const values = [user_id, id];
        const query = await pool.query(text, values);

        return res.status(200).json({message: 'contact deleted successfully'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { getContacts, getContact, postContact, deleteContact, updateContact };
