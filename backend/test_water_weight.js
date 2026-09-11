// Native fetch
const fetch = global.fetch;

async function testWaterWeight() {
    try {
        console.log("1. Registering test user for token...");
        const rnd = Math.floor(Math.random() * 10000);
        const email = `waterweighttest${rnd}@example.com`;
        
        const regRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Water Weight Tester',
                email,
                password: 'password123',
                age: 25,
                gender: 'Male',
                height: 180, // 1.8m
                weight: 80, // initial weight
                dailyCalorieGoal: 2000
            })
        });
        const regData = await regRes.json();
        const token = regData.token;
        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

        console.log("2. Testing Water Tracking...");
        const water1 = await fetch('http://localhost:5000/api/water', {
            method: 'POST',
            headers,
            body: JSON.stringify({ amount: 500 }) // 500ml
        });
        if (water1.status !== 201) throw new Error("Failed to add water");
        
        await fetch('http://localhost:5000/api/water', {
            method: 'POST',
            headers,
            body: JSON.stringify({ amount: 250 }) // 250ml
        });

        const todayWater = await fetch('http://localhost:5000/api/water/today', { headers });
        const todayWaterData = await todayWater.json();
        console.log(`Water total: ${todayWaterData.total}ml (Expected: 750)`);
        if (todayWaterData.total !== 750) throw new Error("Water total mismatch");

        console.log("3. Testing Weight Tracking...");
        const weight1 = await fetch('http://localhost:5000/api/weight', {
            method: 'POST',
            headers,
            body: JSON.stringify({ weight: 75, date: '2026-09-10' }) // New weight
        });
        if (weight1.status !== 201) throw new Error("Failed to add weight");

        const weightHistory = await fetch('http://localhost:5000/api/weight', { headers });
        const weightHistoryData = await weightHistory.json();
        console.log(`Weight history records: ${weightHistoryData.length}`);
        if (weightHistoryData.length !== 1) throw new Error("Weight history mismatch");

        console.log("4. Verifying Dashboard Integrations (BMI & Profile sync)...");
        const dashRes = await fetch('http://localhost:5000/api/dashboard', { headers });
        const dashData = await dashRes.json();
        
        console.log(`Dashboard Water: ${dashData.water}ml (Expected: 750)`);
        if (dashData.water !== 750) throw new Error("Dashboard water mismatch");

        console.log(`Dashboard User Weight: ${dashData.user.weight}kg (Expected: 75, originally 80)`);
        if (dashData.user.weight !== 75) throw new Error("Dashboard user weight was not securely synced to User Profile");

        console.log("5. Testing Bad Data...");
        const badWater = await fetch('http://localhost:5000/api/water', {
            method: 'POST',
            headers,
            body: JSON.stringify({ amount: -500 }) 
        });
        console.log(`Negative water rejected: ${badWater.status === 400}`);

        const badWeight = await fetch('http://localhost:5000/api/weight', {
            method: 'POST',
            headers,
            body: JSON.stringify({ weight: 0, date: '2026-09-10' }) 
        });
        console.log(`Zero weight rejected: ${badWeight.status === 400}`);

        console.log("ALL TESTS PASSED SUCCESSFULLY! ✅");
    } catch (error) {
        console.error("TEST FAILED:", error);
    }
}

testWaterWeight();
