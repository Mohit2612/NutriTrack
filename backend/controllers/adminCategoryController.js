const Category = require('../models/Category');
const FoodItem = require('../models/FoodItem');

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private/Admin
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ createdAt: -1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving categories' });
    }
};

// @desc    Get category by ID
// @route   GET /api/admin/categories/:id
// @access  Private/Admin
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving category' });
    }
};

// @desc    Create new category
// @route   POST /api/admin/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const categoryExists = await Category.findOne({ name: name.trim() });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await Category.create({
            name: name.trim(),
            description
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: 'Invalid category data', error: error.message });
    }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const category = await Category.findById(req.params.id);

        if (category) {
            // If name is changed, check if new name already exists
            if (name && name.trim() !== category.name) {
                const categoryExists = await Category.findOne({ name: name.trim() });
                if (categoryExists) {
                    return res.status(400).json({ message: 'Category name already exists' });
                }

                // IMPORTANT: If we change a category name, should we update FoodItems? 
                // We'll leave FoodItems with the old string for safety, or optionally update them.
                // The instructions say "Do NOT unnecessarily migrate existing data."
                // So we just update the category model.
                category.name = name.trim();
            }

            if (description !== undefined) {
                category.description = description;
            }

            const updatedCategory = await category.save();
            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid category data', error: error.message });
    }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            // Check if any FoodItem uses this category string
            const foodItemExists = await FoodItem.findOne({ category: category.name });
            if (foodItemExists) {
                return res.status(400).json({ message: 'Cannot delete category because it is used by existing foods' });
            }

            await Category.deleteOne({ _id: category._id });
            res.json({ message: 'Category removed' });
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting category' });
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
