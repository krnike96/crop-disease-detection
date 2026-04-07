const { Client } = require('pg');
require('dotenv').config();

const createDatabase = async () => {
    // Connect to the default 'postgres' database first
    const client = new Client({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: 5432,
    });

    try {
        await client.connect();
        // Check if the database exists
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`);

        if (res.rowCount === 0) {
            console.log(`Database ${process.env.DB_NAME} not found. Creating...`);
            await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log(`✅ Database ${process.env.DB_NAME} created successfully.`);
        } else {
            console.log(`✅ Database ${process.env.DB_NAME} already exists.`);
        }
    } catch (err) {
        console.error('❌ Error creating database:', err.message);
    } finally {
        await client.end();
    }
};

createDatabase();