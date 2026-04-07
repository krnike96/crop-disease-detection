const express = require('express');
const router = express.Router();
const controller = require('../controllers/detectionController');
const upload = require('../middleware/upload'); // Moved multer config here

router.post('/detect', upload.single('image'), controller.detectDisease);
router.get('/history', controller.getHistory);
router.delete('/history/:id', controller.deleteHistory);

module.exports = router;