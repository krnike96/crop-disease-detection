const aiService = require('../services/aiService');
const Record = require('../models/Record');
const fs = require('fs');
const path = require('path');

exports.detectDisease = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "Please upload an image" });

        const buffer = fs.readFileSync(req.file.path);
        const prediction = await aiService.predict(buffer);

        const record = await Record.create({
            imagePath: req.file.path,
            label: prediction.label,
            confidence: prediction.confidence
        });

        return res.status(201).json(record);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const history = await Record.findAll({ order: [['createdAt', 'DESC']] });
        return res.json(history);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.deleteHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await Record.findByPk(id);
        if (!record) {
            return res.status(404).json({ error: "Record not found" });
        }

        // Optional: delete the uploaded image file from disk
        if (record.imagePath && fs.existsSync(record.imagePath)) {
            fs.unlinkSync(record.imagePath);
        }

        await record.destroy();
        return res.json({ success: true, message: "Record deleted" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};