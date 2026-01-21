const pgWorkflow = require('../models/workflow.pg');
const pgStep = require('../models/step.pg');

// @desc    Get all workflows
// @route   GET /api/workflows
// @access  Public
const getWorkflows = async (req, res) => {
  try {
    const workflows = await pgWorkflow.getAllWorkflows();
    res.json(workflows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all steps for a workflow
// @route   GET /api/workflows/:id/steps
// @access  Public
const getWorkflowSteps = async (req, res) => {
  try {
    const steps = await pgStep.getStepsForWorkflow(req.params.id);
    const stepsWithResources = await Promise.all(
      steps.map(async (step) => {
        const resources = await pgStep.getResourcesForStep(step.id);
        return { ...step, resources };
      })
    );
    res.json(stepsWithResources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a workflow by ID
// @route   GET /api/workflows/:id
// @access  Public
const getWorkflowById = async (req, res) => {
  try {
    const workflow = await pgWorkflow.getWorkflowById(req.params.id);
    if (workflow) {
      res.json(workflow);
    } else {
      res.status(404).json({ message: 'Workflow not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWorkflows,
  getWorkflowSteps,
  getWorkflowById,
};
