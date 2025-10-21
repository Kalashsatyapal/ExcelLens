require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const chalk = require("chalk");
const seedSuperAdmin = require("./utils/seedSuperAdmin");

const authRoutes = require("./routes/auth");
const uploadRoutes = require("./routes/uploads");
const chartAnalysisRoutes = require("./routes/chartAnalysis");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error(chalk.red.bold("❌ Missing MONGO_URI in .env"));
  process.exit(1);
}

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/auth", authRoutes);
app.use("/uploads", uploadRoutes);
app.use("/chart-analysis", chartAnalysisRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => res.send("🚀 MERN Auth API is up and running!"));

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log(chalk.green.bold("✅ MongoDB connected"));
    await seedSuperAdmin(); // ensure superadmin exists
    app.listen(PORT, () => {
      console.log(chalk.cyan.bold(`🚀 Server running on port ${PORT}`));
    });
  })
  .catch((err) => {
    console.error(chalk.red.bold("❌ MongoDB connection failed:"), err.message);
    process.exit(1);
  });
