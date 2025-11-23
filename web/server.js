require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const path = require("path");
const { sequelize, StoreSettings } = require("./models");
const authRoutes = require("./routes/auth");
const mindlabRoutes = require("./routes/mindlab");

const apiRouter = express.Router();
const v1Router = express.Router();

const app = express();
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// APP routes
v1Router.use("/auth", authRoutes);
v1Router.use("/mindlab", mindlabRoutes);

apiRouter.use('/v1', v1Router);
app.use('/api', apiRouter);

app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection successfully established.');
  } catch (error) {
    console.error('Could not connect to the database:', error);
  }
})();
