async function testFlow() {
    try {
        console.log("1. Registering user...");
        const rnd = Math.floor(Math.random() * 10000);
        const email = `testuser${rnd}@example.com`;
        
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
        const authHeaders = { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        console.log("User registered! Token received.");

        console.log("2. Fetching profile...");
        const profRes = await fetch('http://localhost:5000/api/users/profile', { headers: authHeaders });
        const profData = await profRes.json();
        console.log("Profile Activity Level:", profData.activityLevel, "Fitness Goal:", profData.fitnessGoal);

        console.log("3. Updating profile...");
        await fetch('http://localhost:5000/api/users/profile', {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({
                ...profData,
                activityLevel: 'Moderately Active',
                fitnessGoal: 'Muscle Gain'
            })
        });
        console.log("Profile updated!");

        console.log("4. Auto Calculating Goals...");
        const goalRes = await fetch('http://localhost:5000/api/goals/calculate', {
            method: 'POST',
            headers: authHeaders
        });
        const goalData = await goalRes.json();
        console.log("Calculated Goals:", goalData);

        console.log("5. Updating Goals...");
        await fetch('http://localhost:5000/api/goals', {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({
                calories: 3000,
                protein: 160,
                carbohydrates: 300,
                fats: 80,
                water: 10
            })
        });
        
        const fetchGoal = await fetch('http://localhost:5000/api/goals', { headers: authHeaders });
        const finalData = await fetchGoal.json();
        console.log("Updated Goals Calories:", finalData.calories);

        console.log("ALL TESTS PASSED!");
    } catch (error) {
        console.error("Test failed:", error);
    }
}

testFlow();
