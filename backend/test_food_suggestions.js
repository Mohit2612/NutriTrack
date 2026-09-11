// Native fetch
const fetch = global.fetch;

async function testFoodSuggestions() {
    try {
        console.log("1. Registering test user...");
        const rnd = Math.floor(Math.random() * 10000);
        const email = `suggester${rnd}@example.com`;
        
        const regRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Suggestion Tester',
                email,
                password: 'password123',
                age: 25,
                gender: 'Female',
                height: 165,
                weight: 60,
                dailyCalorieGoal: 1500
            })
        });
        const regData = await regRes.json();
        const token = regData.token;
        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

        console.log("2. Setting up Dietary Preference (Vegan)...");
        await fetch('http://localhost:5000/api/users/profile', {
            method: 'PUT',
            headers,
            body: JSON.stringify({
                name: 'Suggestion Tester',
                dietaryPreference: 'Vegan',
                fitnessGoal: 'Weight Loss'
            })
        });

        console.log("3. Fetching Food Suggestions...");
        const sugRes = await fetch('http://localhost:5000/api/food-suggestions', { headers });
        const sugData = await sugRes.json();
        
        if (sugRes.status !== 200) throw new Error("Suggestion API failed");
        
        console.log(`Returned ${sugData.recommendations.length} recommendations.`);
        
        let foundRestricted = false;
        sugData.recommendations.forEach((rec, idx) => {
            console.log(`[${idx+1}] ${rec.name} (Score: ${rec.score}) - ${rec.reason}`);
            const nameLower = rec.name.toLowerCase();
            const catLower = rec.category.toLowerCase();
            if (nameLower.includes('chicken') || nameLower.includes('milk') || catLower === 'dairy') {
                foundRestricted = true;
                console.error(`ERROR: Vegan restricted food suggested -> ${rec.name}`);
            }
        });

        if (foundRestricted) throw new Error("Dietary preference filter failed.");
        
        console.log("ALL TESTS PASSED SUCCESSFULLY! ✅");
    } catch (error) {
        console.error("TEST FAILED:", error);
    }
}

testFoodSuggestions();
