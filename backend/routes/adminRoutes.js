const express = require('express');
const router = express.Router();
const { getAdminDashboard } = require('../controllers/adminController');
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/adminUserController');
const { getFoods, getFoodById, createFood, updateFood, deleteFood } = require('../controllers/adminFoodController');
const { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/adminCategoryController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// GET /api/admin/dashboard
// Middleware chain: JWT verify → admin role check → controller
router.get('/dashboard', protect, adminOnly, getAdminDashboard);

// User Management Routes
router.route('/users')
    .get(protect, adminOnly, getUsers);
router.route('/users/:id')
    .get(protect, adminOnly, getUserById)
    .put(protect, adminOnly, updateUser)
    .delete(protect, adminOnly, deleteUser);

// Food Management Routes
router.route('/foods')
    .get(protect, adminOnly, getFoods)
    .post(protect, adminOnly, createFood);
router.route('/foods/:id')
    .get(protect, adminOnly, getFoodById)
    .put(protect, adminOnly, updateFood)
    .delete(protect, adminOnly, deleteFood);

// Category Management Routes
router.route('/categories')
    .get(protect, adminOnly, getCategories)
    .post(protect, adminOnly, createCategory);
router.route('/categories/:id')
    .get(protect, adminOnly, getCategoryById)
    .put(protect, adminOnly, updateCategory)
    .delete(protect, adminOnly, deleteCategory);

module.exports = router;
