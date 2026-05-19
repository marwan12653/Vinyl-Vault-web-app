const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Import Modular Routing Engines
const authRoutes = require('./routes/auth');
const vaultRoutes = require('./routes/vault');
const feedRoutes = require('./routes/feed');
const catalogRoutes = require('./routes/catalog'); // Dynamic cloud music explorer

// Initialize Express Server Instance
const app = express();
app.use(express.static('public'));

// Fire Up Secure Handshake to Cloud Cluster
connectDB();

// Global Network Request Pre-Processing Middleware
app.use(cors());
app.use(express.json());

// Mount Endpoints into API Namespace Architecture
app.use('/api/auth', authRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/catalog', catalogRoutes); // Maps dynamic database tracks to storefront

// Root Baseline Server Heartbeat Route
app.get('/', (req, res) => {
  res.send('Vinyl Vault Full-Stack API Layer Active and Connected.');
});

// Bind Port and Listen for Incoming Frontend Requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server fully operational at http://localhost:${PORT}`);
});