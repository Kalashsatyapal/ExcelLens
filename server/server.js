require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const seedSuperAdmin = require('./utils/seedSuperAdmin'); // 👈 New utility
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/uploads');
const chartAnalysisRoutes = require('./routes/chartAnalysis');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/chart-analysis', chartAnalysisRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send('Welcome to MERN Auth API'));

// Connect to DB and seed Super Admin
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    await seedSuperAdmin(); // 👈 Explicit call
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
