const User = require('../models/User');

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving users' });
    }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error retrieving user' });
    }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.age = req.body.age || user.age;
            user.gender = req.body.gender || user.gender;
            user.height = req.body.height || user.height;
            user.weight = req.body.weight || user.weight;
            user.activityLevel = req.body.activityLevel || user.activityLevel;
            user.fitnessGoal = req.body.fitnessGoal || user.fitnessGoal;
            user.dietaryPreference = req.body.dietaryPreference || user.dietaryPreference;

            // Handle role update
            if (req.body.role === 'user' || req.body.role === 'admin') {
                // If attempting to remove admin role
                if (user.role === 'admin' && req.body.role === 'user') {
                    // Check if it's the last admin
                    const adminCount = await User.countDocuments({ role: 'admin' });
                    if (adminCount <= 1) {
                        return res.status(400).json({ message: 'Cannot remove the last admin' });
                    }
                }
                user.role = req.body.role;
            }

            const updatedUser = await user.save();
            
            // Return user without password
            const userToReturn = updatedUser.toObject();
            delete userToReturn.password;

            res.json(userToReturn);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error updating user', error: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // Prevent deleting current admin
            if (user._id.toString() === req.user._id.toString()) {
                return res.status(400).json({ message: 'Cannot delete yourself' });
            }

            // If deleting an admin, ensure it's not the last one
            if (user.role === 'admin') {
                const adminCount = await User.countDocuments({ role: 'admin' });
                if (adminCount <= 1) {
                    return res.status(400).json({ message: 'Cannot delete the last admin' });
                }
            }

            await User.deleteOne({ _id: user._id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting user' });
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};
