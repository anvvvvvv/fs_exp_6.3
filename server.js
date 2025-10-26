const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const transferRoutes = require('./routes/transferRoutes');
const Account = require('./models/Account');

dotenv.config();
const app = express();

connectDB();
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.send('🏦 Account Transfer API Running...');
});

// Transfer route
app.use('/api/transfer', transferRoutes);

// Example: Create sample accounts (for testing)
app.post('/api/create', async (req, res) => {
  try {
    const { accountNumber, ownerName, balance } = req.body;
    const account = new Account({ accountNumber, ownerName, balance });
    await account.save();
    res.json(account);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
