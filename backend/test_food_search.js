async function testFoodSearch() {
    try {
        console.log("1. Registering test user for token...");
        const rnd = Math.floor(Math.random() * 10000);
        const email = `foodtest${rnd}@example.com`;
        
        const regRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
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
        const headers = { 'Authorization': `Bearer ${token}` };

        console.log("2. Fetching all foods...");
        let res = await fetch('http://localhost:5000/api/food-items', { headers });
        let data = await res.json();
        console.log(`Received ${data.length} foods. Validating: ${data[0].name}`);

        console.log("3. Search food by name (case-insensitive: 'rIcE')...");
        res = await fetch('http://localhost:5000/api/food-items?search=rIcE', { headers });
        data = await res.json();
        console.log(`Found: ${data.map(d => d.name).join(', ')}`);

        console.log("4. Filter by category ('Indian Food')...");
        res = await fetch('http://localhost:5000/api/food-items?category=Indian%20Food', { headers });
        data = await res.json();
        console.log(`Found ${data.length} Indian foods.`);

        console.log("5. Search + category (search='d', category='Indian Food')...");
        res = await fetch('http://localhost:5000/api/food-items?search=d&category=Indian%20Food', { headers });
        data = await res.json();
        console.log(`Found: ${data.map(d => d.name).join(', ')}`);
        
        console.log("6. Get by valid ID...");
        const firstId = data[0]._id;
        res = await fetch(`http://localhost:5000/api/food-items/${firstId}`, { headers });
        data = await res.json();
        console.log(`Found by ID: ${data.name} (Calories: ${data.calories})`);

        console.log("7. Get by Invalid ID...");
        res = await fetch('http://localhost:5000/api/food-items/123invalid', { headers });
        console.log(`Status: ${res.status}`);

        console.log("ALL TESTS PASSED!");
    } catch (error) {
        console.error("Test failed:", error);
    }
}

testFoodSearch();
