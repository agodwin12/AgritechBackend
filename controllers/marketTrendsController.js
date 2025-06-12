const Product = require('../models/Product');
const ProductPriceLog = require('../models/ProductPriceLog');

// GET /api/market-trends/summary

const getMarketSummary = async (req, res) => {
    const { region, from, to } = req.query;

    const where = {};
    if (region && region !== 'All') where.market_region = region;
    if (from && to) {
        where.createdAt = { [Op.between]: [new Date(from), new Date(to)] };
    }

    try {
        const products = await Product.findAll({
            where,
            attributes: ['name', 'price'],
        });

        const grouped = {};
        products.forEach(({ name, price }) => {
            if (!grouped[name]) grouped[name] = [];
            grouped[name].push(parseFloat(price));
        });

        const summary = Object.entries(grouped).map(([crop, prices]) => {
            const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
            return { crop, avg_price: avg.toFixed(2) };
        });

        res.json(summary);
    } catch (err) {
        console.error("❌ Market summary error:", err);
        res.status(500).json({ message: 'Server error' });
    }
};


// GET /api/market-trends/:cropName
const getCropTrend = async (req, res) => {
    try {
        const cropName = req.params.cropName;

        const logs = await ProductPriceLog.findAll({
            include: [{
                model: Product,
                attributes: ['name'],
                where: { name: cropName }
            }],
            order: [['logged_at', 'ASC']],
        });

        const trend = logs.map(log => ({
            date: log.logged_at,
            price: log.price,
        }));

        res.status(200).json({ crop: cropName, trend });
    } catch (err) {
        console.error("❌ Error in getCropTrend:", err);
        res.status(500).json({ message: 'Server error' });
    }
};


// controllers/marketTrendsController.js
const submitMarketPrice = async (req, res) => {
    const { crop_name, price, market_region } = req.body;
    const userId = req.user?.id;

    if (!crop_name || !price || !market_region) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const product = await Product.create({
            name: crop_name,
            price,
            market_region,
            description: 'User-submitted price',
            stock_quantity: 1,
            seller_id: userId,
            CategoryId: 1, // placeholder or inferred from name
            SubCategoryId: 1,
        });

        res.status(201).json({ message: 'Price submitted', product });
    } catch (e) {
        console.error('❌ Submission failed:', e);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    getMarketSummary,
    getCropTrend,
};
