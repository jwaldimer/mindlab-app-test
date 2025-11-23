const axios = require("axios");

const MINDLAB_BASE_URL = process.env.MINDLAB_BASE_URL;

class AuthService {
  /**
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.password
   * @returns {Promise<{ data: Object }>}
   */
  static async signIn({ email, password }) {
    try {
      const response = await axios.post(
        `${MINDLAB_BASE_URL}/auth/signin`,
        {
          email,
          password
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000
        }
      );

      const data = response.data;
      const token = data.access_token;
      const user = {
        id: data.userData.id,
        email: data.userData.email,
        companyId: data.userData.companyId,
      }

      if (!token || !user) {
        const error = new Error("Invalid response");
        error.type = "AUTH_INVALID_RESPONSE";
        error.rawResponse = data;
        throw error;
      }

      return { token, user };
    } catch (err) {
      let errorData = {
        type: "AUTH_UNKNOWN_ERROR",
        message: "Unspected authentication error",
        details: err.message,
        status: 500
      };

      if (err.response) {
        const status = err.response.status;
        errorData = { 
          type: "AUTH_UPSTREAM_ERROR",
          message: "Authentication error",
          details: err.response.data,
          status: status
        };

        if (status === 401 || status === 400) {
          errorData = { 
            type: "AUTH_INVALID_CREDENTIALS",
            message: "Invalid credentials",
            details: err.response.data,
            status: status
          }
        }
      }

      if (err.code === "ECONNABORTED" || err.code === "ENOTFOUND") {
        errorData = { 
          type: "AUTH_NETWORK_ERROR",
          message: "Error connecting with external API",
          details: err.message,
          status: 500
        }
      }
      
      const error = new Error(errorData.message);
      error.type = errorData.type;
      error.status = errorData.status;
      error.details = err.message;
      throw error;
    }
  }
}

module.exports = AuthService;
