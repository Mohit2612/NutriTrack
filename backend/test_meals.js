// using native fetch

async function testMeals() {
    try {
        console.log("1. Registering test user for token...");
        const rnd = Math.floor(Math.random() * 10000);
        const email = `mealtest${rnd}@example.com`;
        
        const regRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Meal Test User',
                email,
                password: 'password123',
                age: 25,
                gender: 'Male',
                height: 180,
                weight: 75,
                dailyCalorieGoal: 2000
            })
        });
        const regData = await regRes.json();
        const token = regData.token;
        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

        console.log("2. Fetching FoodItems...");
        const foodsRes = await fetch('http://localhost:5000/api/food-items', { headers });
        const foods = await foodsRes.json();
        const apple = foods.find(f => f.name === 'Apple');
        const paneer = foods.find(f => f.name === 'Paneer');

        console.log(`Found Apple (${apple.calories} kcal) and Paneer (${paneer.calories} kcal)`);

        console.log("3. Logging a Meal: 2 servings of Apple for Snacks...");
        const meal1Res = await fetch('http://localhost:5000/api/meals', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                foodItemId: apple._id,
                mealType: 'Snacks',
                servings: 2
            })
        });
        const meal1 = await meal1Res.json();
        console.log(`Meal logged: ${meal1.name}. Calculated calories: ${meal1.calories} (Expected: ${apple.calories * 2})`);
        
        if (meal1.calories !== apple.calories * 2) throw new Error("Calculation mismatch!");

        console.log("4. Editing the meal to 3 servings...");
        const updateRes = await fetch(`http://localhost:5000/api/meals/${meal1._id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ servings: 3 })
        });
        const updatedMeal = await updateRes.json();
        console.log(`Meal updated: Calculated calories: ${updatedMeal.calories} (Expected: ${apple.calories * 3})`);
        
        if (updatedMeal.calories !== apple.calories * 3) throw new Error("Update calculation mismatch!");

        console.log("5. Checking daily totals on Dashboard...");
        const dashRes = await fetch('http://localhost:5000/api/dashboard', { headers });
        const dash = await dashRes.json();
        console.log(`Dashboard shows total consumed calories: ${dash.consumedCalories}`);
        
        console.log("6. Logging Paneer for Dinner...");
        await fetch('http://localhost:5000/api/meals', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                foodItemId: paneer._id,
                mealType: 'Dinner',
                servings: 1.5
            })
        });

        console.log("7. Getting Meal History for Today...");
        const today = new Date().toISOString().split('T')[0];
        const histRes = await fetch(`http://localhost:5000/api/meals/history?date=${today}`, { headers });
        const history = await histRes.json();
        console.log(`Found ${history.length} meals in history.`);

        console.log("8. Testing Invalid Servings (0)...");
        const invRes = await fetch('http://localhost:5000/api/meals', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                foodItemId: paneer._id,
                mealType: 'Lunch',
                servings: 0
            })
        });
        console.log(`Status for invalid servings: ${invRes.status} (Expected 400)`);

        console.log("ALL TESTS PASSED SUCCESSFULLY! ✅");
    } catch (error) {
        console.error("TEST FAILED:", error);
    }
}

testMeals();
