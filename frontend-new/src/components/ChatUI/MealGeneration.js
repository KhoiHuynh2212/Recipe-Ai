// lists the available meal options for the MealGeneration test case

function generateMealOptions(criteria)
{
    const meals = 
    {
        vegetarian: ["Tofu Burritos", "Cheese Alfredo", "Macaroni and Cheese"],
        vegan: ["Cucumber Salad", "Tofu Scramble", "Vegan Chili"],
        keto: ["Grilled Chicken", "Keto Meatloaf", "Spicy Edamame Dip"]
    };

    return meals[criteria.diet] || [];
}

module.exports = { generateMealOptions };