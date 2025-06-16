// routes/market.js
const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');

router.get('/top-products', marketController.topProducts);
router.get('/top-sellers', marketController.topSellers);

module.exports = router;
