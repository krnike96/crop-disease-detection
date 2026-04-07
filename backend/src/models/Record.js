const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Record = sequelize.define('Record', {
    imagePath: { type: DataTypes.STRING, allowNull: false },
    label: { type: DataTypes.STRING, allowNull: false },
    confidence: { type: DataTypes.FLOAT, allowNull: false },
}, {
    timestamps: true
});

module.exports = Record;