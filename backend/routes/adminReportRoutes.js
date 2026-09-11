const express = require('express');
const router = express.Router();
const {
    getUserReport,
    getFoodReport,
    getMealReport,
    getWaterReport,
    getWeightReport
} = require('../controllers/adminReportController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Base route is /api/admin/reports, applied in server.js

router.get('/users', protect, adminOnly, getUserReport);
router.get('/foods', protect, adminOnly, getFoodReport);
router.get('/meals', protect, adminOnly, getMealReport);
router.get('/water', protect, adminOnly, getWaterReport);
router.get('/weight', protect, adminOnly, getWeightReport);

module.exports = router;
