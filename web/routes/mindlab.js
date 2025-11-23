const express = require("express");
const mindlab_controller = require("../controllers/mindlabController");
const widget_controller = require("../controllers/widgetController");

const router = express.Router();

// POST api/v1/mindlab/agents/select
router.post("/agents/select", mindlab_controller.select_agent);

// GET api/v1/mindlab/agents/:companyId
router.get("/agents/:companyId", mindlab_controller.get_agents);

// GET api/v1/mindlab/widget/widget.js
router.get("/widget/widget.js", widget_controller.get_widget);

module.exports = router;
