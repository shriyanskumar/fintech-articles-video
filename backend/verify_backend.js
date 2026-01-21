const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

const verify = async () => {
    try {
        console.log('1. Fetching all workflows...');
        const workflowsRes = await axios.get(`${BASE_URL}/workflows`);
        console.log(`   Found ${workflowsRes.data.length} workflows.`);

        if (workflowsRes.data.length === 0) {
            console.error('   No workflows found! Database might be empty.');
            return;
        }

        const id = workflowsRes.data[0]._id;
        console.log(`   Testing with ID: ${id}`);

        console.log('2. Fetching Single Workflow...');
        try {
            const workflowRes = await axios.get(`${BASE_URL}/workflows/${id}`);
            console.log(`   Success! Title: ${workflowRes.data.title}`);
        } catch (e) {
            console.error(`   FAILED to fetch single workflow: ${e.message}`);
            if (e.response) {
                console.error(`   Status: ${e.response.status}`);
                console.error(`   Data:`, e.response.data);
            }
        }

        console.log('3. Fetching Steps...');
        try {
            const stepsRes = await axios.get(`${BASE_URL}/workflows/${id}/steps`);
            console.log(`   Success! Found ${stepsRes.data.length} steps.`);
        } catch (e) {
            console.error(`   FAILED to fetch steps: ${e.message}`);
        }

    } catch (error) {
        console.error('Fatal Error:', error.message);
    }
};

verify();
