/**
 * create_test_admin.js
 * 
 * DEVELOPMENT ONLY — Safe admin seeder script
 * 
 * Run once to create a test admin account for development purposes.
 * It checks if the admin already exists before creating.
 * 
 * HOW TO RUN:
 *   node create_test_admin.js
 * 
 * (Run from the backend/ directory with MongoDB running)
 * 
 * Credentials created:
 *   Email:    admin@test.com
 *   Password: Admin@123
 *   Role:     admin
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = 'Admin@123';

const createAdmin = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB.');

        // Check if admin already exists
        const existing = await User.findOne({ email: ADMIN_EMAIL });
        if (existing) {
            if (existing.role === 'admin') {
                console.log(`✅ Admin already exists: ${ADMIN_EMAIL}`);
            } else {
                // User exists but is not an admin — upgrade safely
                existing.role = 'admin';
                await existing.save();
                console.log(`✅ Existing user upgraded to admin: ${ADMIN_EMAIL}`);
            }
            await mongoose.disconnect();
            return;
        }

        // Hash password manually (bypasses the pre-save hook since we're using create directly)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

        // Use insertOne directly to bypass the bcrypt pre-save hook
        // (password is already hashed above, so we avoid double-hashing)
        await User.collection.insertOne({
            name: 'Test Admin',
            email: ADMIN_EMAIL,
            password: hashedPassword,
            age: 30,
            gender: 'Other',
            height: 170,
            weight: 70,
            dailyCalorieGoal: 2000,
            activityLevel: 'Sedentary',
            fitnessGoal: 'Maintain Weight',
            dietaryPreference: 'Other',
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        console.log(`✅ Test admin created successfully!`);
        console.log(`   Email:    ${ADMIN_EMAIL}`);
        console.log(`   Password: ${ADMIN_PASSWORD}`);
        console.log(`   Role:     admin`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    } catch (error) {
        console.error('❌ Failed to create admin:', error.message);
        await mongoose.disconnect();
        process.exit(1);
    }
};

createAdmin();
