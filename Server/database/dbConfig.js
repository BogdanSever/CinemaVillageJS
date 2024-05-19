const sql = require('mssql/msnodesqlv8');

const connectionString = 'Driver={ODBC Driver 17 for SQL Server};Server=SEYFER;Database=CinemaDB;Trusted_Connection=yes;';

const config = {
    connectionString: connectionString,
    options: {
        trustServerCertificate: true, // Set to false for production
        trustedConnection: true,
        encrypt: false  // Use this if your SQL Server is configured to require encrypted connections
    }
}

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server Successfully');
        return pool;
    })
    .catch(err => {
        console.error('Database Connection Failed', err);
        process.exit(1);
    });

module.exports = poolPromise;