/**
 * Determines if a food is restricted based on dietary preference
 * @param {Object} food - The FoodItem
 * @param {String} preference - User's dietaryPreference (Vegetarian, Vegan, Non-Vegetarian, Other)
 * @returns {Boolean} true if the food should be excluded
 */
const isRestricted = (food, preference) => {
    const nameLower = food.name.toLowerCase();
    const catLower = food.category.toLowerCase();

    const meatKeywords = ['chicken', 'beef', 'pork', 'fish', 'meat', 'egg', 'mutton', 'prawn', 'salmon'];
    const dairyKeywords = ['milk', 'cheese', 'paneer', 'curd', 'yogurt', 'ghee', 'butter', 'dairy'];

    const hasMeat = meatKeywords.some(kw => nameLower.includes(kw));
    const hasDairy = dairyKeywords.some(kw => nameLower.includes(kw)) || catLower === 'dairy';

    if (preference === 'Vegetarian' && hasMeat) return true;
    if (preference === 'Vegan' && (hasMeat || hasDairy)) return true;
    
    return false;
};

/**
 * Calculates a recommendation score for a food item.
 * @param {Object} food - The FoodItem
 * @param {Object} user - User profile
 * @param {Object} goal - User's Nutrition Goal
 * @param {Object} intake - Today's aggregated intake { calories, protein, carbs, fat, fiber }
 * @returns {Object} { score: Number, reason: String }
 */
const calculateScore = (food, user, goal, intake) => {
    let score = 50; // Base score
    let reasons = [];

    // Nutrition constraints
    const remainingCalories = (user.dailyCalorieGoal || 2000) - (intake.calories || 0);
    const remainingProtein = goal && goal.protein ? goal.protein - (intake.protein || 0) : 50;
    
    const calorieDensity = food.calories / (food.servingSize || 100);

    // 1. Goal-based scoring
    switch (user.fitnessGoal) {
        case 'Weight Loss':
            if (calorieDensity < 1.5) { score += 15; reasons.push('Low calorie density.'); }
            if (food.fiber > 4) { score += 10; reasons.push('High in fiber to keep you full.'); }
            if (food.calories > 400) { score -= 20; }
            break;
        case 'Weight Gain':
            if (calorieDensity > 2) { score += 15; reasons.push('Calorie dense.'); }
            if (food.calories > 300) { score += 10; }
            break;
        case 'Muscle Gain':
            if (food.protein > 15) { score += 25; reasons.push('Excellent protein source for muscle growth.'); }
            if (food.protein > 8 && food.protein <= 15) { score += 10; reasons.push('Good protein source.'); }
            break;
        case 'Maintain Weight':
            if (food.fiber > 3) score += 5;
            if (food.protein > 5) score += 5;
            reasons.push('Balanced choice for maintenance.');
            break;
        default:
            break;
    }

    // 2. Real-time Intake Adjustment
    if (remainingCalories < 200 && food.calories > 250) {
        score -= 30; // Heavily penalize foods that would blow the calorie budget
    } else if (remainingCalories < 300 && food.calories <= 150) {
        score += 15;
        reasons.push('Fits well within your remaining calories today.');
    }

    if (remainingProtein > 20 && food.protein > 10) {
        score += 20;
        reasons.push('Helps meet your remaining protein target.');
    }

    // Default reason if none matched
    if (reasons.length === 0) {
        reasons.push(`Suitable for your ${user.dietaryPreference !== 'Other' ? user.dietaryPreference : ''} diet.`);
    }

    // Format the reason string cleanly
    const finalReason = [...new Set(reasons)].join(' ');

    return { score, reason: finalReason };
};

/**
 * Gets the top personalized food recommendations.
 * @param {Array} foods - All FoodItems
 * @param {Object} user - User profile
 * @param {Object} goal - User's Nutrition Goal
 * @param {Object} intake - Today's aggregated intake
 * @param {Number} limit - Max recommendations to return
 * @returns {Array} Top ranked food items
 */
const getRecommendations = (foods, user, goal, intake, limit = 5) => {
    const scoredFoods = foods
        .filter(food => !isRestricted(food, user.dietaryPreference))
        .map(food => {
            const { score, reason } = calculateScore(food, user, goal, intake);
            return {
                ...food.toObject(),
                score,
                reason
            };
        });

    // Sort by highest score first
    scoredFoods.sort((a, b) => b.score - a.score);

    return scoredFoods.slice(0, limit);
};

module.exports = { getRecommendations };
