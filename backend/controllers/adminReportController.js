const User = require('../models/User');
const FoodItem = require('../models/FoodItem');
const Meal = require('../models/Meal');
const Water = require('../models/Water');
const WeightLog = require('../models/WeightLog');
const { getLocalDateString } = require('../utils/dateUtils');

// Helper to calculate date ranges for filtering
const getDateRangeFilter = (rangeStr, fieldName = 'date') => {
    const today = new Date();
    let startDate = new Date();

    if (!rangeStr) {
        // default 30d
        startDate.setDate(today.getDate() - 30);
    } else if (rangeStr === '7d') {
        startDate.setDate(today.getDate() - 7);
    } else if (rangeStr === '30d') {
        startDate.setDate(today.getDate() - 30);
    } else if (rangeStr === '3m') {
        startDate.setMonth(today.getMonth() - 3);
    } else {
        return null; // Invalid
    }

    if (fieldName === 'date') {
        // For models using string 'YYYY-MM-DD'
        const offset = startDate.getTimezoneOffset();
        const localStartDate = new Date(startDate.getTime() - (offset * 60 * 1000));
        return { $gte: localStartDate.toISOString().split('T')[0] };
    } else {
        // For models using Date objects like createdAt
        return { $gte: startDate };
    }
};

// @desc    Get user summary report
// @route   GET /api/admin/reports/users
// @access  Private / Admin only
const getUserReport = async (req, res, next) => {
    try {
        const { range } = req.query;
        const dateFilter = getDateRangeFilter(range, 'createdAt');
        if (!dateFilter) {
            res.status(400);
            throw new Error('Invalid date range');
        }
        if (!dateFilter) {
            res.status(400);
            throw new Error('Invalid date range');
        }

        // We can get totals regardless of date, and new users within range
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        const newUsersInRange = await User.countDocuments({ role: 'user', createdAt: dateFilter });

        // Aggregate by fitness goal
        const usersByFitnessGoal = await User.aggregate([
            { $match: { role: 'user' } },
            { $group: { _id: "$fitnessGoal", count: { $sum: 1 } } }
        ]);

        // Aggregate by dietary preference
        const usersByDietaryPreference = await User.aggregate([
            { $match: { role: 'user' } },
            { $group: { _id: "$dietaryPreference", count: { $sum: 1 } } }
        ]);

        // Aggregate by gender
        const usersByGender = await User.aggregate([
            { $match: { role: 'user' } },
            { $group: { _id: "$gender", count: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            totalUsers,
            totalAdmins,
            newUsersInRange,
            usersByFitnessGoal: usersByFitnessGoal.map(item => ({ name: item._id || 'Unknown', value: item.count })),
            usersByDietaryPreference: usersByDietaryPreference.map(item => ({ name: item._id || 'Unknown', value: item.count })),
            usersByGender: usersByGender.map(item => ({ name: item._id || 'Unknown', value: item.count }))
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get food summary report
// @route   GET /api/admin/reports/foods
// @access  Private / Admin only
const getFoodReport = async (req, res, next) => {
    try {
        const totalFoods = await FoodItem.countDocuments();

        const foodsByCategory = await FoodItem.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        const averages = await FoodItem.aggregate([
            {
                $group: {
                    _id: null,
                    averageCalories: { $avg: "$calories" },
                    averageProtein: { $avg: "$protein" },
                    averageCarbs: { $avg: "$carbohydrates" },
                    averageFats: { $avg: "$fats" },
                    averageFiber: { $avg: "$fiber" }
                }
            }
        ]);

        const avgData = averages.length > 0 ? averages[0] : {
            averageCalories: 0, averageProtein: 0, averageCarbs: 0, averageFats: 0, averageFiber: 0
        };

        res.json({
            success: true,
            totalFoods,
            foodsByCategory: foodsByCategory.map(item => ({ name: item._id || 'Unknown', value: item.count })),
            averageCalories: Math.round(avgData.averageCalories || 0),
            averageProtein: Math.round(avgData.averageProtein || 0),
            averageCarbs: Math.round(avgData.averageCarbs || 0),
            averageFats: Math.round(avgData.averageFats || 0),
            averageFiber: Math.round(avgData.averageFiber || 0)
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get meal summary report
// @route   GET /api/admin/reports/meals
// @access  Private / Admin only
const getMealReport = async (req, res, next) => {
    try {
        const { range } = req.query;
        const dateFilter = getDateRangeFilter(range, 'date');
        if (!dateFilter) {
            res.status(400);
            throw new Error('Invalid date range');
        }

        const totalMeals = await Meal.countDocuments({ date: dateFilter });

        const mealsByType = await Meal.aggregate([
            { $match: { date: dateFilter } },
            { $group: { _id: "$mealType", count: { $sum: 1 } } }
        ]);

        const averages = await Meal.aggregate([
            { $match: { date: dateFilter } },
            {
                $group: {
                    _id: null,
                    averageCalories: { $avg: "$calories" },
                    averageProtein: { $avg: "$protein" },
                    averageCarbs: { $avg: "$carbohydrates" },
                    averageFats: { $avg: "$fats" }
                }
            }
        ]);

        const avgData = averages.length > 0 ? averages[0] : {
            averageCalories: 0, averageProtein: 0, averageCarbs: 0, averageFats: 0
        };

        res.json({
            success: true,
            totalMeals,
            mealsByType: mealsByType.map(item => ({ name: item._id, value: item.count })),
            averageCaloriesPerMeal: Math.round(avgData.averageCalories),
            averageProteinPerMeal: Math.round(avgData.averageProtein),
            averageCarbsPerMeal: Math.round(avgData.averageCarbs),
            averageFatsPerMeal: Math.round(avgData.averageFats)
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get water summary report
// @route   GET /api/admin/reports/water
// @access  Private / Admin only
const getWaterReport = async (req, res, next) => {
    try {
        const { range } = req.query;
        const dateFilter = getDateRangeFilter(range, 'date');
        if (!dateFilter) {
            res.status(400);
            throw new Error('Invalid date range');
        }

        const waterData = await Water.aggregate([
            { $match: { date: dateFilter } },
            {
                $group: {
                    _id: "$date",
                    totalAmountDate: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const totalWaterLogs = await Water.countDocuments({ date: dateFilter });
        const totalWaterMl = waterData.reduce((acc, curr) => acc + curr.totalAmountDate, 0);
        const averageDailyWaterMl = waterData.length > 0 ? (totalWaterMl / waterData.length) : 0;

        res.json({
            success: true,
            totalWaterLogs,
            totalWaterMl,
            averageDailyWaterMl: Math.round(averageDailyWaterMl),
            waterLogsByDate: waterData.map(item => ({ date: item._id, amount: item.totalAmountDate }))
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get weight summary report
// @route   GET /api/admin/reports/weight
// @access  Private / Admin only
const getWeightReport = async (req, res, next) => {
    try {
        const { range } = req.query;
        const dateFilter = getDateRangeFilter(range, 'date');
        if (!dateFilter) {
            res.status(400);
            throw new Error('Invalid date range');
        }

        const weightData = await WeightLog.aggregate([
            { $match: { date: dateFilter } },
            {
                $group: {
                    _id: "$date",
                    averageWeightDate: { $avg: "$weight" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const totalWeightLogs = await WeightLog.countDocuments({ date: dateFilter });
        const sumAvgWeights = weightData.reduce((acc, curr) => acc + curr.averageWeightDate, 0);
        const averageRecordedWeight = weightData.length > 0 ? (sumAvgWeights / weightData.length) : 0;

        res.json({
            success: true,
            totalWeightLogs,
            averageRecordedWeight: Number(averageRecordedWeight.toFixed(2)),
            weightLogsByDate: weightData.map(item => ({ date: item._id, averageWeight: Number(item.averageWeightDate.toFixed(2)), count: item.count }))
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserReport,
    getFoodReport,
    getMealReport,
    getWaterReport,
    getWeightReport
};
