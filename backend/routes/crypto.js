const express = require('express');
const Crypto = require('../models/Crypto');
const router = express.Router();

// Seed initial data if empty
const seedData = async () => {
  try {
    const count = await Crypto.countDocuments();
    if (count === 0) {
      await Crypto.insertMany([
        { name: 'Bitcoin', symbol: 'BTC', price: 65000, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', priceChange24h: 2.5 },
        { name: 'Ethereum', symbol: 'ETH', price: 3500, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', priceChange24h: 1.2 },
        { name: 'Solana', symbol: 'SOL', price: 150, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', priceChange24h: -0.5 },
        { name: 'Pepe', symbol: 'PEPE', price: 0.000008, image: 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg', priceChange24h: 15.4 },
        { name: 'Dogecoin', symbol: 'DOGE', price: 0.15, image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', priceChange24h: -2.1 },
        { name: 'Cardano', symbol: 'ADA', price: 0.45, image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', priceChange24h: 0.8 }
      ]);
      console.log('Seed crypto data inserted');
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};

// GET all
router.get('/', async (req, res) => {
  try {
    await seedData(); // Ensure data is seeded
    const cryptos = await Crypto.find({});
    res.json({ success: true, data: cryptos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET gainers
router.get('/gainers', async (req, res) => {
  try {
    await seedData();
    const gainers = await Crypto.find({}).sort({ priceChange24h: -1 }).limit(10);
    res.json({ success: true, data: gainers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET new (sort by newest createdAt)
router.get('/new', async (req, res) => {
  try {
    await seedData();
    const newCryptos = await Crypto.find({}).sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, data: newCryptos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST new crypto
router.post('/', async (req, res) => {
  try {
    const { name, symbol, price, image, priceChange24h } = req.body;
    if (!name || !symbol || price === undefined || !image || priceChange24h === undefined) {
      return res.status(400).json({ success: false, error: 'Please provide all fields' });
    }
    const crypto = await Crypto.create({ name, symbol, price, image, priceChange24h });
    res.status(201).json({ success: true, data: crypto });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
