const express = require("express");
const router = express.Router();
const {
  getWorkflows,
  getWorkflowSteps,
  getWorkflowById,
} = require("../controllers/workflowController");

// Route order: /:id/steps before /:id
router.get("/", getWorkflows);
router.get("/:id/steps", getWorkflowSteps);
router.get("/:id", getWorkflowById);

module.exports = router;
