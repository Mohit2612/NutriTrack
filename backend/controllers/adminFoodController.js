const FoodItem = require('../models/FoodItem');
const Meal = require('../models/Meal');

// @desc    Get all foods
// @route   GET /api/admin/foods
// @access  Private/Admin
const getFoods = async (req, res) => {
    try {
        const foods = await FoodItem.find({}).sort({ createdAt: -1 });
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving foods' });
    }
};

// @desc    Get food by ID
// @route   GET /api/admin/foods/:id
// @access  Private/Admin
const getFoodById = async (req, res) => {
    try {
        const food = await FoodItem.findById(req.params.id);
        if (food) {
            res.json(food);
        } else {
            res.status(404).json({ message: 'Food not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving food' });
    }
};

// @desc    Create new food
// @route   POST /api/admin/foods
// @access  Private/Admin
const createFood = async (req, res) => {
    try {
        const { name, category, calories, protein, carbohydrates, fats, fiber, servingSize, servingUnit } = req.body;

        const foodExists = await FoodItem.findOne({ name });
        if (foodExists) {
            return res.status(400).json({ message: 'Food item already exists' });
        }

        const food = await FoodItem.create({
            name,
            category,
            calories,
            protein,
            carbohydrates,
            fats,
            fiber,
            servingSize,
            servingUnit
        });

        res.status(201).json(food);
    } catch (error) {
        res.status(400).json({ message: 'Invalid food data', error: error.message });
    }
};

// @desc    Update food
// @route   PUT /api/admin/foods/:id
// @access  Private/Admin
const updateFood = async (req, res) => {
    try {
        const { name, category, calories, protein, carbohydrates, fats, fiber, servingSize, servingUnit } = req.body;

        const food = await FoodItem.findById(req.params.id);

        if (food) {
            food.name = name || food.name;
            food.category = category || food.category;
            food.calories = calories !== undefined ? calories : food.calories;
            food.protein = protein !== undefined ? protein : food.protein;
            food.carbohydrates = carbohydrates !== undefined ? carbohydrates : food.carbohydrates;
            food.fats = fats !== undefined ? fats : food.fats;
            food.fiber = fiber !== undefined ? fiber : food.fiber;
            food.servingSize = servingSize !== undefined ? servingSize : food.servingSize;
            food.servingUnit = servingUnit || food.servingUnit;

            const updatedFood = await food.save();
            res.json(updatedFood);
        } else {
            res.status(404).json({ message: 'Food not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid food data', error: error.message });
    }
};

// @desc    Delete food
// @route   DELETE /api/admin/foods/:id
// @access  Private/Admin
const deleteFood = async (req, res) => {
    try {
        const food = await FoodItem.findById(req.params.id);

        if (food) {
            // Check if food is used in any Meal
            const mealExists = await Meal.findOne({ foodItem: food._id });
            if (mealExists) {
                return res.status(400).json({ message: 'Cannot delete food because it is referenced in user meals' });
            }

            await FoodItem.deleteOne({ _id: food._id });
            res.json({ message: 'Food removed' });
        } else {
            res.status(404).json({ message: 'Food not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting food', error: error.message });
    }
};

module.exports = {
    getFoods,
    getFoodById,
    createFood,
    updateFood,
    deleteFood
};
