# Expenses App - Fullstack App - Frontend

Link to [Frontend Repo](https://github.com/PRATAP-KUMAR/expenses-app-front-end)

## Steps

```bash
git clone https://github.com/PRATAP-KUMAR/expenses-app-back-end
cd expenses-app-back-end
npm install
```

### Prerequisite
1. you must have PostgreSQL installed in your local machine.
2. you must create a new database with your choice of name for the database.
3. you must import the `expensesdb_tables.sql` file into above created database using the below command line replacing the correct values for the -U and -d options (user name and database name)

    Below is an example command, you must replace `admin` with your username and `workoutsdb` with your database name.

    ```bash
    psql -U admin -W -d workoutsdb -f expensesdb_tables.sql
    ```
4. you must create a `.env` file with a PORT number of your choice and with 32 characters long `SECRET` key of your own for example

    ```bash
    PORT=3002
    SECRET=your32bitsecretkeyofyourown123456
    ```

5. you must edit the `db.js` file with details of your postgres config for username, database etc.

    ```js
    const pool = new Pool({
    user: 'admin', // replace with yours
    host: 'localhost', // since we choose local machine as the database, its always localhost.
    port: 5432, // by default this is the value for PostgreSQL
    database: 'expensesdb', // replace with yours as mentioned in the step 2 above.
    })
    ```

##
Finally run the below command to start backend server
```bash
npm run dev
```

The backend is connected if you see the below message on the console/terminal.
```bash
connected to db, listening on port 3002
```