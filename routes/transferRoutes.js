// routes/transferRoutes.js
const express = require('express');
const router = express.Router();
const Account = require('../models/Account');

// POST /api/transfer
router.post('/', async (req, res) => {
  const { fromAccount, toAccount, amount } = req.body;

  if (!fromAccount || !toAccount || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (amount <= 0) {
    return res.status(400).json({ error: 'Transfer amount must be positive' });
  }

  try {
    // Step 1: Fetch both accounts
    const sender = await Account.findOne({ accountNumber: fromAccount });
    const receiver = await Account.findOne({ accountNumber: toAccount });

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'One or both accounts not found' });
    }

    // Step 2: Validate balance
    if (sender.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Step 3: Perform updates (without transactions)
    sender.balance -= amount;
    receiver.balance += amount;

    // Step 4: Save updates sequentially to maintain consistency
    await sender.save();
    await receiver.save();

    return res.json({
      message: '✅ Transfer successful',
      from: sender.accountNumber,
      to: receiver.accountNumber,
      amount,
      senderBalance: sender.balance,
      receiverBalance: receiver.balance,
    });

  } catch (err) {
    console.error('❌ Transfer error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
