// backend/models/workflow.pg.js
// PostgreSQL query helpers for workflows
const pool = require('../config/db');

/**
 * Get all workflows (optionally filtered by type)
 * @param {string} [type] - Optional workflow type ('apply' or 'learn')
 * @returns {Promise<Array>} Array of workflow objects
 */
async function getAllWorkflows(type) {
  let query = 'SELECT * FROM workflows';
  let params = [];
  if (type) {
    query += ' WHERE type = $1';
    params.push(type);
  }
  const { rows } = await pool.query(query, params);
  return rows;
}

/**
 * Get a single workflow by ID
 * @param {number} id - Workflow ID
 * @returns {Promise<Object|null>} Workflow object or null
 */
async function getWorkflowById(id) {
  const { rows } = await pool.query('SELECT * FROM workflows WHERE id = $1', [id]);
  return rows[0] || null;
}

module.exports = {
  getAllWorkflows,
  getWorkflowById,
};
