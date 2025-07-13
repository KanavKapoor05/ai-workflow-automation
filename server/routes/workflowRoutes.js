const express = require("express");
const router = express.Router();
const { generateWorkflow } = require("../controllers/workflowController");

router.post("/workflow", generateWorkflow);

module.exports = router;
