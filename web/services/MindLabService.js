const axios = require("axios");

const MINDLAB_BASE_URL = process.env.MINDLAB_BASE_URL;

class MindLabService {
  /**
   * Get the list of available agents from MindLab.
   * @param {string} token - JWT token returned by MindLab on signin
   * @param {string} companyId - ID of company
   */
  static async getAgents({ token, companyId }) {
    try {
      const response = await axios.get(
        `${MINDLAB_BASE_URL}/widget/agents/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          timeout: 10000
        }
      );
      
      return response.data;
    } catch (err) {
      let errorData = {
        type: "AGENTS_NETWORK_ERROR",
        message: "Unable to connect to MindLab to obtain agents.",
        details: err.message,
        status: 500
      };

      if (err.response) {
        errorData = {
          type: "AGENTS_UPSTREAM_ERROR",
          message: "Error retrieving agents from MindLab.",
          details: err.response.data.message,
          status: err.response.status
        };
      }

      const error = new Error(errorData.message);
      error.type = errorData.type;
      error.details = errorData.details;
      error.status = errorData.status;
      throw error;
    }
  }

  /**
   * Retrieves a specific AI agent by ID from MindLab.
   * @param {string} token - JWT token returned by MindLab on signin
   * @param {string} agentId - ID of agent
   */
  static async getAgent({ token, agentId }) {
    try {
      const response = await axios.get(
        `${MINDLAB_BASE_URL}/agents/ai/${agentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          timeout: 10000
        }
      );
      
      return response.data;
    } catch (err) {
      let errorData = {
        type: "AGENT_NETWORK_ERROR",
        message: "Unable to connect to MindLab to obtain agent.",
        details: err.message,
        status: 500
      };

      if (err.response) {
        errorData = {
          type: "AGENT_UPSTREAM_ERROR",
          message: "Error retrieving agent from MindLab.",
          details: err.response.data.message,
          status: err.response.status
        };
      }

      const error = new Error(errorData.message);
      error.type = errorData.type;
      error.details = errorData.details;
      error.status = errorData.status;
      throw error;
    }
  }

  /**
   * Decode JWT payload and try to extract email.
   */
  static getEmailFromToken(token) {
    if (!token) return null;

    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      const payloadBase64 = parts[1];

      const json = Buffer.from(payloadBase64, "base64url").toString("utf8");
      const payload = JSON.parse(json);

      return (payload.email || null);
    } catch (err) {
      console.error("Error decoding JWT payload:", err.message);
      return null;
    }
  }
}

module.exports = MindLabService;
