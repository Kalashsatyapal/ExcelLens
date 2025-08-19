require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const chalk = require('chalk'); // 👈 For colored logs
const seedSuperAdmin = require('./utils/seedSuperAdmin');

const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/uploads');
const chartAnalysisRoutes = require('./routes/chartAnalysis');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// 🧪 Validate environment
if (!MONGO_URI) {
  console.error(chalk.red.bold('❌ Missing MONGO_URI in .env'));
  process.exit(1);
}

// 🧩 Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 🚦 Routes
app.use('/api/auth', authRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/chart-analysis', chartAnalysisRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send('🚀 MERN Auth API is up and running!'));

// 🔌 Connect to DB and start server
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log(chalk.green.bold(`[${new Date().toLocaleTimeString()}] ✅ MongoDB connected`));
    await seedSuperAdmin();
    app.listen(PORT, () => {
      console.log(chalk.cyan.bold(`[${new Date().toLocaleTimeString()}] 🚀 Server running at http://localhost:${PORT}`));
    });
  })
  .catch(err => {
    console.error(chalk.red.bold(`[${new Date().toLocaleTimeString()}] ❌ MongoDB connection failed:`), err.message);
    process.exit(1);
  });
