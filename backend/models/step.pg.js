// backend/models/step.pg.js
// PostgreSQL query helpers for steps
const pool = require('../config/db');

/**
 * Get all steps for a workflow, ordered by 'order'.
 * @param {number} workflowId - Workflow ID
 * @returns {Promise<Array>} Array of step objects
 */
async function getStepsForWorkflow(workflowId) {
  const { rows } = await pool.query(
    'SELECT * FROM steps WHERE workflow_id = $1 ORDER BY "order" ASC',
    [workflowId]
  );
  return rows;
}

/**
 * Get resources for a step
 * @param {number} stepId - Step ID
 * @returns {Promise<Array>} Array of resource objects
 */
async function getResourcesForStep(stepId) {
  const { rows } = await pool.query(
    'SELECT * FROM resources WHERE step_id = $1',
    [stepId]
  );
  return rows;
}

module.exports = {
  getStepsForWorkflow,
  getResourcesForStep,
};
