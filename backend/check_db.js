dotenv.config();
const dotenv = require('dotenv');
const pool = require('./config/db');

dotenv.config();

const checkData = async () => {
    try {
        const workflowCountRes = await pool.query('SELECT COUNT(*) FROM workflows');
        const stepCountRes = await pool.query('SELECT COUNT(*) FROM steps');

        console.log(`Workflows: ${workflowCountRes.rows[0].count}`);
        console.log(`Steps: ${stepCountRes.rows[0].count}`);

        const workflowsRes = await pool.query('SELECT id, title FROM workflows');
        console.log('Sample Workflow IDs:', workflowsRes.rows);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkData();
