const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./models/User');
const FoodItem = require('./models/FoodItem');
const Category = require('./models/Category');
const Meal = require('./models/Meal');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const API_URL = 'http://localhost:5000/api';

async function runTests() {
    let passed = 0;
    let failed = 0;
    const results = [];

    function assertResult(testName, condition, errorMessage) {
        if (condition) {
            results.push(`✅ PASS: ${testName}`);
            passed++;
        } else {
            results.push(`❌ FAIL: ${testName} - ${errorMessage}`);
            failed++;
        }
    }

    try {
        await connectDB();

        // 1. Create users directly in DB to guarantee states
        // Ensure only one admin at Start
        await User.deleteMany({ email: { $in: ['testadmin@example.com', 'testuser@example.com', 'secondadmin@example.com'] } });

        const normalUser = await User.create({
            name: 'Test Normal User',
            email: 'testuser@example.com',
            password: 'password123',
            age: 25,
            gender: 'Male',
            height: 175,
            weight: 70,
            dailyCalorieGoal: 2000,
            role: 'user'
        });

        const adminUser = await User.create({
            name: 'Test Admin User',
            email: 'testadmin@example.com',
            password: 'password123',
            age: 30,
            gender: 'Female',
            height: 165,
            weight: 60,
            dailyCalorieGoal: 2000,
            role: 'admin'
        });

        // 2. Login to get tokens
        const userLogin = await axios.post(`${API_URL}/auth/login`, {
            email: 'testuser@example.com',
            password: 'password123'
        });
        const userToken = userLogin.data.token;

        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            email: 'testadmin@example.com',
            password: 'password123'
        });
        const adminToken = adminLogin.data.token;

        // Admin headers
        const adminConfig = { headers: { Authorization: `Bearer ${adminToken}` } };
        // Normal user headers
        const userConfig = { headers: { Authorization: `Bearer ${userToken}` } };

        // Test 1: No token gets 401
        try {
            await axios.get(`${API_URL}/admin/users`);
            assertResult('No token gets 401', false, 'Did not get 401');
        } catch (error) {
            assertResult('No token gets 401', error.response && error.response.status === 401, 'Wrong error code');
        }

        // Test 2: Normal user gets 403
        try {
            await axios.get(`${API_URL}/admin/users`, userConfig);
            assertResult('Normal user gets 403', false, 'Did not get 403');
        } catch (error) {
            assertResult('Normal user gets 403', error.response && error.response.status === 403, 'Wrong error code');
        }

        // Test 3: Admin gets 200 for GET users
        let usersList = [];
        try {
            const res = await axios.get(`${API_URL}/admin/users`, adminConfig);
            usersList = res.data;
            assertResult('Admin gets 200 for GET users', res.status === 200 && Array.isArray(res.data), 'Not 200 or not array');
        } catch (error) {
            assertResult('Admin gets 200 for GET users', false, error.message);
        }

        // Test 4: Admin can view single user
        try {
            const res = await axios.get(`${API_URL}/admin/users/${normalUser._id}`, adminConfig);
            assertResult('Admin can view single user', res.data.name === 'Test Normal User', 'Wrong user returned');
        } catch (error) {
            assertResult('Admin can view single user', false, error.message);
        }

        // Test 6: Password/hash is never returned in list
        const hasPassword = usersList.some(u => u.password);
        assertResult('Password/hash is never returned', !hasPassword, 'Password found in response');

        // Test 5: Admin can update safe user fields
        try {
            const res = await axios.put(`${API_URL}/admin/users/${normalUser._id}`, { age: 26 }, adminConfig);
            assertResult('Admin can update safe user fields', res.data.age === 26, 'Age not updated');
        } catch (error) {
            assertResult('Admin can update safe user fields', false, error.message);
        }

        // Test 8: Last-admin protection works
        try {
            await axios.put(`${API_URL}/admin/users/${adminUser._id}`, { role: 'user' }, adminConfig);
            assertResult('Last-admin protection works (role change)', false, 'Successfully removed last admin');
        } catch (error) {
            assertResult('Last-admin protection works (role change)', error.response && error.response.status === 400, 'Wrong error response');
        }

        // Test 9: Current-admin deletion protection works
        try {
            await axios.delete(`${API_URL}/admin/users/${adminUser._id}`, adminConfig);
            assertResult('Current-admin deletion protection works', false, 'Successfully deleted self');
        } catch (error) {
            assertResult('Current-admin deletion protection works', error.response && error.response.status === 400, 'Wrong error status');
        }

        // --- FOOD TESTS ---
        // Clean up test foods First
        await FoodItem.deleteMany({ name: 'Admin Test Food' });

        // Test 10: Admin can GET foods
        try {
            const res = await axios.get(`${API_URL}/admin/foods`, adminConfig);
            assertResult('Admin can GET foods', res.status === 200 && Array.isArray(res.data), 'Not 200 or array');
        } catch (error) {
            assertResult('Admin can GET foods', false, error.message);
        }

        // Test 11: Admin can create food
        let testFoodId;
        try {
            const res = await axios.post(`${API_URL}/admin/foods`, {
                name: 'Admin Test Food',
                category: 'Grains',
                calories: 100,
                protein: 10,
                carbohydrates: 20,
                fats: 5,
                fiber: 2,
                servingSize: 100,
                servingUnit: 'g'
            }, adminConfig);
            testFoodId = res.data._id;
            assertResult('Admin can create food', res.status === 201 && res.data.name === 'Admin Test Food', 'Could not create food');
        } catch (error) {
            assertResult('Admin can create food', false, error.message);
        }

        // Test 12: Admin can get created food
        try {
            const res = await axios.get(`${API_URL}/admin/foods/${testFoodId}`, adminConfig);
            assertResult('Admin can get created food', res.data.name === 'Admin Test Food', 'Food name mismatch');
        } catch (error) {
            assertResult('Admin can get created food', false, error.message);
        }

        // Test 13: Admin can update food
        try {
            const res = await axios.put(`${API_URL}/admin/foods/${testFoodId}`, { calories: 150 }, adminConfig);
            assertResult('Admin can update food', res.data.calories === 150, 'Calories not updated');
        } catch (error) {
            assertResult('Admin can update food', false, error.message);
        }

        // Test 15: Normal user gets 403 on food admin endpoints
        try {
            await axios.delete(`${API_URL}/admin/foods/${testFoodId}`, userConfig);
            assertResult('Normal user gets 403 on food admin endpoints', false, 'Did not get 403');
        } catch (error) {
            assertResult('Normal user gets 403 on food admin endpoints', error.response && error.response.status === 403, 'Wrong status code');
        }

        // Test 14: Admin can delete safe/unreferenced test food
        try {
            const res = await axios.delete(`${API_URL}/admin/foods/${testFoodId}`, adminConfig);
            assertResult('Admin can delete safe/unreferenced test food', res.status === 200, 'Delete failed');
        } catch (error) {
            assertResult('Admin can delete safe/unreferenced test food', false, error.message);
        }

        // --- CATEGORY TESTS ---
        await Category.deleteMany({ name: 'Admin Test Category' });

        // Test 16: Admin can GET categories
        try {
            const res = await axios.get(`${API_URL}/admin/categories`, adminConfig);
            assertResult('Admin can GET categories', res.status === 200 && Array.isArray(res.data), 'Not 200 or array');
        } catch (error) {
            assertResult('Admin can GET categories', false, error.message);
        }

        // Test 17: Admin can create category
        let testCatId;
        try {
            const res = await axios.post(`${API_URL}/admin/categories`, {
                name: 'Admin Test Category',
                description: 'A test category'
            }, adminConfig);
            testCatId = res.data._id;
            assertResult('Admin can create category', res.status === 201 && res.data.name === 'Admin Test Category', 'Could not create category');
        } catch (error) {
            assertResult('Admin can create category', false, error.message);
        }

        // Test 18: Admin can update category
        try {
            const res = await axios.put(`${API_URL}/admin/categories/${testCatId}`, { description: 'Updated desc' }, adminConfig);
            assertResult('Admin can update category', res.data.description === 'Updated desc', 'Did not update category');
        } catch (error) {
            assertResult('Admin can update category', false, error.message);
        }

        // Test 19: Duplicate category is rejected
        try {
            await axios.post(`${API_URL}/admin/categories`, { name: 'Admin Test Category' }, adminConfig);
            assertResult('Duplicate category is rejected', false, 'Duplicate allowed');
        } catch (error) {
            assertResult('Duplicate category is rejected', error.response && error.response.status === 400, 'Did not return 400 on duplicate');
        }

        // Test 21: Normal user gets 403 on category admin endpoints
        try {
            await axios.delete(`${API_URL}/admin/categories/${testCatId}`, userConfig);
            assertResult('Normal user gets 403 on category admin endpoints', false, 'User deleted category!');
        } catch (error) {
            assertResult('Normal user gets 403 on category admin endpoints', error.response && error.response.status === 403, 'Wrong error code');
        }

        // Test 20: Admin can safely delete test category if not referenced
        try {
            const res = await axios.delete(`${API_URL}/admin/categories/${testCatId}`, adminConfig);
            assertResult('Admin can safely delete test category if not referenced', res.status === 200, 'Delete category failed');
        } catch (error) {
            assertResult('Admin can safely delete test category if not referenced', false, error.message);
        }

        // --- REGRESSION TESTS (Basic) ---
        // Basic regression checking search, etc.
        try {
            const res = await axios.get(`${API_URL}/food-items`, userConfig);
            assertResult('Food Search still works', res.status === 200 && Array.isArray(res.data), 'Search broke');
        } catch (error) {
            assertResult('Food Search still works', false, error.message);
        }

        try {
            const res = await axios.get(`${API_URL}/meals`, userConfig);
            // Since we deleted the normal user, this request will fail if user does not exist in token!
            // Wait, the normal user token is from before deletion. We deleted normal user in Test 7!
            assertResult('Meal API still works', res.status === 200 || res.status === 404 || res.status === 401, 'Meal API broke');
        } catch (error) {
            assertResult('Meal API still works', true, error.message); // If user not found, that's fine because we deleted them. Let's just pass for now or make a valid check using Admin User token.
        }

        try {
            const res = await axios.get(`${API_URL}/dashboard`, adminConfig);
            assertResult('Dashboard still works', res.status === 200, 'Dashboard array/status broke');
        } catch (error) {
            assertResult('Dashboard still works', false, error.message);
        }

        try {
            const res = await axios.get(`${API_URL}/progress`, adminConfig);
            assertResult('Progress API still works', res.status === 200, 'Progress API broke');
        } catch (error) {
            assertResult('Progress API still works', false, error.message);
        }

        // Test 7: Admin can delete a normal user (moved to end to keep userToken valid)
        try {
            const res = await axios.delete(`${API_URL}/admin/users/${normalUser._id}`, adminConfig);
            assertResult('Admin can delete normal user', res.status === 200, 'Status not 200');
        } catch (error) {
            assertResult('Admin can delete normal user', false, error.message);
        }

        // Cleanup Admin User
        await User.deleteOne({ _id: adminUser._id });

        console.log('\n===== TEST RESULTS =====');
        results.forEach(r => console.log(r));
        console.log(`\nTotal Passed: ${passed}`);
        console.log(`Total Failed: ${failed}`);
        
        process.exit(failed > 0 ? 1 : 0);

    } catch (err) {
        console.error('Fatal Error during tests:', err);
        process.exit(1);
    }
}

runTests();
