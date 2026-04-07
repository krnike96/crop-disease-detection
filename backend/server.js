require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/config/database');
const detectionRoutes = require('./src/routes/detectionRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api', detectionRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
    console.log('PostgreSQL Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});