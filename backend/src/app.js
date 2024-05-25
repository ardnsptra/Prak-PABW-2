const express = require('express');
const authRoutes = require('./routes/auth');
const sequelize = require('./config/config');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static('uploads'));


sequelize.sync().then(() => {
    console.log('Database connected');
  }).catch((error) => {
    console.error('Error connecting to the database:', error);
  });

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
