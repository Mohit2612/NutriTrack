// Native fetch
const fetch = global.fetch;

async function testProgress() {
    try {
        console.log("1. Registering test user for token...");
        const rnd = Math.floor(Math.random() * 10000);
        const email = `progresstest${rnd}@example.com`;
        
        const regRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Progress Tester',
                email,
                password: 'password123',
                age: 25,
                gender: 'Male',
                height: 180,
                weight: 80,
                dailyCalorieGoal: 2000
            })
        });
        const regData = await regRes.json();
        const token = regData.token;
        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

        console.log("2. Adding some data...");
        // Add Water
        await fetch('http://localhost:5000/api/water', {
            method: 'POST',
            headers,
            body: JSON.stringify({ amount: 1500 }) 
        });

        // Add Weight
        await fetch('http://localhost:5000/api/weight', {
            method: 'POST',
            headers,
            body: JSON.stringify({ weight: 79 })
        });

        // Test API Progress ranges
        console.log("3. Fetching Progress (7d)...");
        const prog7 = await fetch('http://localhost:5000/api/progress?range=7d', { headers });
        const prog7Data = await prog7.json();
        
        if (prog7.status !== 200) throw new Error("Progress API failed for 7d");
        console.log(`Weight Chart length: ${prog7Data.weight.length}`);
        console.log(`Water Chart length: ${prog7Data.water.length}`);
        console.log(`Average Water: ${prog7Data.summary.averageWater}ml`);
        console.log(`BMI: ${prog7Data.summary.bmi}`);

        if (prog7Data.summary.averageWater !== 1500) throw new Error("Average water incorrect");

        console.log("4. Testing invalid range...");
        const progBad = await fetch('http://localhost:5000/api/progress?range=100d', { headers });
        if (progBad.status !== 400) throw new Error("Invalid range not rejected");

        console.log("ALL TESTS PASSED SUCCESSFULLY! ✅");
    } catch (error) {
        console.error("TEST FAILED:", error);
    }
}

testProgress();
