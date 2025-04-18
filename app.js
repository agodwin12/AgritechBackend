const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth');
const myProfileRoutes = require('./routes/myProfileRoutes');


app.use(cors());
app.use(express.json()); // ✅ VERY IMPORTANT
app.use(express.urlencoded({ extended: true }));


app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/myprofile', myProfileRoutes);


// Sync Sequelize Models
sequelize.sync().then(() => {
    console.log('🟢 Database synced');
    app.listen(process.env.PORT, () => {
        console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
}).catch((err) => {
    console.error('❌ Failed to sync DB:', err);
});
