const User = require('../models/User');
const FoodItem = require('../models/FoodItem');
const Meal = require('../models/Meal');
const Water = require('../models/Water');
const WeightLog = require('../models/WeightLog');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private / Admin only
const getAdminDashboard = async (req, res, next) => {
    try {
        // Run all count queries in parallel for efficiency
        const [
            totalUsers,
            totalAdmins,
            totalFoodItems,
            totalMeals,
            totalWaterLogs,
            totalWeightLogs
        ] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            User.countDocuments({ role: 'admin' }),
            FoodItem.countDocuments({}),
            Meal.countDocuments({}),
            Water.countDocuments({}),
            WeightLog.countDocuments({})
        ]);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalAdmins,
                totalFoodItems,
                totalMeals,
                totalWaterLogs,
                totalWeightLogs
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAdminDashboard };
