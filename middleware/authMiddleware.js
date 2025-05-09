require('dotenv').config(); // Add this at the very top if not already present
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log("🔐 JWT_SECRET:", process.env.JWT_SECRET); // Should be 'agritech'

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            return res.status(401).json({ message: 'Invalid token payload' });
        }

        req.user = { id: decoded.id };
        console.log('✅ Authenticated user ID:', req.user.id);
        next();
    } catch (err) {
        console.error('❌ JWT verification failed:', err.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = { authenticate };
