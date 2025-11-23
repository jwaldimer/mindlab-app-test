const MindLabService = require("../services/MindLabService");
const { StoreSettings } = require("../models");
const WidgetService = require("../services/WidgetService");

const get_agents = async (req, res) => {
  const authHeader = req.headers.authorization;
  const { companyId } = req.params;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ statusCode: 401, message: "Authentication token required!" });
  }

  if (!companyId) {
    return res.status(400).json({ statusCode: 400, message: "companyId required!" });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const agents = await MindLabService.getAgents({ token, companyId });

    return res.status(200).json({ agents });
  } catch (error) {
    console.error("Error in GET api/v1/mindlab/agents:", error.type, error.details || error.message);
    let resp = {};

    switch(error.type) {
      case "AGENTS_NETWORK_ERROR":
        resp = { message: "Unable to connect to the MindLab service!" };
        break;
      case "AGENTS_UPSTREAM_ERROR":
        resp = { message: "MindLab service error when obtaining agents" };
        break;
      default:
        resp = { message: "Internal error obtaining agents" };
    }

    return res.status(error.status).json({
      statusCode: error.status,
      message: resp.message
    });
  }
};

const select_agent = async (req, res) => {
  const authHeader = req.headers.authorization;
  const { agentId } = req.body;
  const shopDomain = process.env.SHOPIFY_SHOP_DOMAIN;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ statusCode: 401, message: "Authentication token required!" });
  }

  if (!agentId) {
    return res.status(400).json({
      statusCode: 400,
      message: "agentId required",
    });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const agent = await MindLabService.getAgent({ token, agentId });
    const mindlabUserEmail = MindLabService.getEmailFromToken(token);
    const currentDate = new Date();
    const scriptTag = await WidgetService.getScriptTag(shopDomain);

    const values = {
      shopDomain,
      mindlabUserEmail,
      mindlabAuthToken: token,
      mindlabCompanyId: agent.companyId,
      selectedAgentId: agent.id,
      agentToken: agent.apiKey,
      widgetActive: true,
      primaryColor: agent?.customization?.backgroundColor,
      language: agent?.config?.language,
      scriptTagId: scriptTag && scriptTag.id,
      connectedAt: currentDate,
      lastSync: currentDate
    };

    const [settings] = await StoreSettings.upsert(values, { returning: true });

    return res.status(200).json({
      message: "Agent selection saved and widget script tag configured",
      settings
    });
  } catch (error) {
    let resp = {};
    console.error(error);

    if (error.name == "SequelizeDatabaseError") {
      resp = { code: 500, message: error.message };
    } else if (error.type){
      resp = { code: error.status, message: error.details };
    } else {
      resp = { code: 500, message: "Could not select agent or configure widget" };
    }

    return res.status(resp.code).json({
      statusCode: resp.code,
      message: resp.message
    });
  }
};

module.exports = {
  get_agents,
  select_agent,
};
