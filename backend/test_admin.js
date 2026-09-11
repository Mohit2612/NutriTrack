/**
 * test_admin.js
 * 
 * Tests for Item 10: Admin Authentication + Admin Dashboard
 * 
 * Run with: node test_admin.js
 * (Requires backend server running on port 5000)
 */

const BASE_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, options);
    const data = await res.json();
    return { status: res.status, data };
}

async function runTests() {
    console.log('=== NutriTrack Admin Tests ===\n');
    let passed = 0;
    let failed = 0;

    function assert(testName, condition, detail = '') {
        if (condition) {
            console.log(`  ✅ PASS: ${testName}`);
            passed++;
        } else {
            console.log(`  ❌ FAIL: ${testName}${detail ? ' — ' + detail : ''}`);
            failed++;
        }
    }

    // ── Register a normal user ──────────────────────────────────────────────
    const rnd = Math.floor(Math.random() * 99999);
    const normalEmail = `normaluser${rnd}@test.com`;

    const regRes = await request('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Normal User',
            email: normalEmail,
            password: 'password123',
            age: 25, gender: 'Male', height: 175, weight: 70,
            dailyCalorieGoal: 2000
        })
    });

    const normalToken = regRes.data.token;
    const normalHeaders = {
        'Authorization': `Bearer ${normalToken}`,
        'Content-Type': 'application/json'
    };

    // ── Test 1: No token → 401 ──────────────────────────────────────────────
    console.log('\nTest 1: No token → 401');
    const t1 = await request('/admin/dashboard');
    assert('No token returns 401', t1.status === 401);

    // ── Test 2: Normal user token → 403 ────────────────────────────────────
    console.log('\nTest 2: Normal user token → 403');
    const t2 = await request('/admin/dashboard', { headers: { 'Authorization': `Bearer ${normalToken}` } });
    assert('Normal user gets 403', t2.status === 403);
    assert('Response has success: false', t2.data.success === false);

    // ── Test 3: Admin login ─────────────────────────────────────────────────
    console.log('\nTest 3: Admin login');
    const adminLogin = await request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@test.com', password: 'Admin@123' })
    });
    assert('Admin login succeeds (200)', adminLogin.status === 200);
    assert('Admin login returns role=admin', adminLogin.data.role === 'admin');

    const adminToken = adminLogin.data.token;
    const adminHeaders = { 'Authorization': `Bearer ${adminToken}` };

    // ── Test 4: Admin dashboard → 200 ──────────────────────────────────────
    console.log('\nTest 4: Admin dashboard → 200');
    const t4 = await request('/admin/dashboard', { headers: adminHeaders });
    assert('Admin gets 200', t4.status === 200);
    assert('Response has success: true', t4.data.success === true);
    assert('Response has stats object', typeof t4.data.stats === 'object');

    // ── Test 5: Response contains all required fields ───────────────────────
    console.log('\nTest 5: Stats contain required fields');
    const stats = t4.data.stats || {};
    assert('Has totalUsers', typeof stats.totalUsers === 'number');
    assert('Has totalAdmins', typeof stats.totalAdmins === 'number');
    assert('Has totalFoodItems', typeof stats.totalFoodItems === 'number');
    assert('Has totalMeals', typeof stats.totalMeals === 'number');
    assert('Has totalWaterLogs', typeof stats.totalWaterLogs === 'number');
    assert('Has totalWeightLogs', typeof stats.totalWeightLogs === 'number');
    assert('totalAdmins is at least 1', stats.totalAdmins >= 1, `Got: ${stats.totalAdmins}`);
    console.log(`   Stats received: ${JSON.stringify(stats)}`);

    // ── Test 6: Normal user dashboard still works ───────────────────────────
    console.log('\nTest 6: Normal user dashboard still works');
    const t6 = await request('/dashboard', { headers: normalHeaders });
    assert('Normal /dashboard returns 200', t6.status === 200);

    // ── Test 7: Registration returns role in response ───────────────────────
    console.log('\nTest 7: Registration response includes role');
    assert('Register response has role field', regRes.data.role === 'user');

    // ── Summary ─────────────────────────────────────────────────────────────
    console.log(`\n${'='.repeat(40)}`);
    console.log(`Results: ${passed} passed, ${failed} failed`);
    if (failed === 0) {
        console.log('ALL TESTS PASSED ✅');
    } else {
        console.log('SOME TESTS FAILED ❌');
        process.exit(1);
    }
}

runTests().catch(err => {
    console.error('Test runner error:', err.message);
    process.exit(1);
});
