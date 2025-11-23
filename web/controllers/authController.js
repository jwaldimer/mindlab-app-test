const AuthService = require("../services/AuthService");

const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ statusCode: 400, message: "Email and password are required" });
  }

  try {
    const { token, user } = await AuthService.signIn({ email, password });

    return res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error in /auth/signin:", error.type, error.details || error.message);
    let resp = {};

    switch(error.type) {
      case "AUTH_INVALID_CREDENTIALS":
        resp = { code: 401, message: "Invalid credentials" };
        break;
      case "AUTH_NETWORK_ERROR":
        resp = { code: 503, message: "Unable to connect to the authentication service" };
        break;
      case "AUTH_UPSTREAM_ERROR":
        resp = { code: 502, message: "Error in external authentication service" };
        break;
      default:
        resp = { code: 500, message: "Internal error during authentication" };
    }

    return res.status(resp.code).json({
      statusCode: resp.code,
      message: resp.message
    });
  }
};

module.exports = {
  signin,
};
