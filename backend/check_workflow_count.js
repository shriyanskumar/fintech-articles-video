dotenv.config();
const dotenv = require('dotenv');
const pool = require('./config/db');

dotenv.config();

const checkWorkflows = async () => {
    try {
        const workflowsRes = await pool.query('SELECT type, title FROM workflows');
        console.log('--- DB Workflows ---');
        workflowsRes.rows.forEach(w => console.log(`[${w.type}] ${w.title}`));
        console.log('--------------------');

        // Check specifically for apply
        const applyCountRes = await pool.query("SELECT COUNT(*) FROM workflows WHERE type = 'apply'");
        console.log(`Total 'apply' workflows: ${applyCountRes.rows[0].count}`);

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkWorkflows();
