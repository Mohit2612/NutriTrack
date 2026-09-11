// Native fetch

async function testDashboard() {
    try {
        console.log("1. Registering test user for token...");
        const rnd = Math.floor(Math.random() * 10000);
        const email = `dashtest${rnd}@example.com`;
        
        const regRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Dashboard Tester',
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

        console.log("2. Fetching existing foods for DB...");
        const foodsRes = await fetch('http://localhost:5000/api/food-items', { headers });
        const foods = await foodsRes.json();
        const apple = foods.find(f => f.name === 'Apple'); // 95 kcal

        console.log("3. Logging 1 meal (2 Apples = 190 kcal)");
        await fetch('http://localhost:5000/api/meals', {
            method: 'POST',
            headers,
            body: JSON.stringify({ foodItemId: apple._id, mealType: 'Breakfast', servings: 2 })
        });

        console.log("4. Fetching Dashboard...");
        const dashRes = await fetch('http://localhost:5000/api/dashboard', { headers });
        const dash = await dashRes.json();
        
        console.log("Dashboard user:", dash.user.name);
        console.log("Consumed calories:", dash.consumed.calories);
        console.log("Remaining calories:", dash.remainingCalories);
        
        if (dash.consumed.calories !== 190) throw new Error("Calories mismatch");
        if (dash.remainingCalories !== 1810) throw new Error("Remaining mismatch");

        console.log("5. Testing Over Target State (Logging 30 Apples = 2850 kcal)");
        await fetch('http://localhost:5000/api/meals', {
            method: 'POST',
            headers,
            body: JSON.stringify({ foodItemId: apple._id, mealType: 'Lunch', servings: 30 })
        });

        const dashRes2 = await fetch('http://localhost:5000/api/dashboard', { headers });
        const dash2 = await dashRes2.json();

        console.log("Consumed calories:", dash2.consumed.calories); // 190 + 2850 = 3040
        console.log("Remaining calories:", dash2.remainingCalories); // Should be 0
        console.log("Is Over Target:", dash2.isOverTarget); // Should be true

        if (dash2.remainingCalories !== 0) throw new Error("Negative remaining calories not capped to 0");
        if (!dash2.isOverTarget) throw new Error("isOverTarget not true");

        console.log("ALL TESTS PASSED SUCCESSFULLY! ✅");
    } catch (error) {
        console.error("TEST FAILED:", error);
    }
}

testDashboard();
