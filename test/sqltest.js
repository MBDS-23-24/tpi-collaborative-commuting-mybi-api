const sql = require('mssql');

const config = {
    user: 'commutingAdmin',  // Replace with your database username
    password: 'badisBoucheffa123@',  // Replace with your database password
    server: 'commuting.database.windows.net',  // Your Azure SQL server name
    database: 'commutingDB',  // Your Azure SQL database name
    port: 1433,  // Default SQL Server port
    options: {
        encrypt: true,  // Necessary for Azure SQL Database
        enableArithAbort: true
    }
}
console.log("Starting...");



async function connectAndQuery() {
    try {
        // Establish a connection to the database
        const pool = await sql.connect(config);

        console.log("Connected to the Azure SQL Database successfully.");

        // Perform a sample query - modify as needed
        const result = await pool.request().query('SELECT TOP 10 * FROM Users');
        
        // Log the results
        console.log("Query results:", result.recordset);

        // Close the database connection
        await pool.close();
        console.log("Connection closed.");
    } catch (err) {
        console.error('Error occurred:', err);
    }
}

console.log("Starting...");
connectAndQuery();