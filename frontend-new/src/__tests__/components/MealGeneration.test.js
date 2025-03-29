//const { generateMealOptions } = require("./mealGenerator");
import { generateMealOptions } from "../../components/ChatUI/MealGeneration";

describe("Meal Generator", () => {
    test("should list vegetarian options", () => {
        const criteria = { diet: "vegetarian"};
        const result = generateMealOptions(criteria);
        expect(result).toEqual(["Tofu Burritos", "Cheese Alfredo", "Macaroni and Cheese"]);
    });

    test("should return vegan meal options", () => {
        const criteria = { diet: "vegan" };
        const result = generateMealOptions(criteria);
        expect(result).toEqual(["Cucumber Salad", "Tofu Scramble", "Vegan Chili"]);
    });

    test("should return keto meal options", () => {
        const criteria = { diet: "keto" };
        const result = generateMealOptions(criteria);
        expect(result).toEqual(["Grilled Chicken", "Keto Meatloaf", "Spicy Edamame Dip"]);
    });

    test("should return an empty array for unsupported criteria", () => {
        const criteria = { diet: "paleo" }; // not an option for meal diets
        const result = generateMealOptions(criteria);
        expect(result).toEqual([]);
    });

    test("should return an empty array if no diet is specified", () => {
        const criteria = {}; // no diet provided
        const result = generateMealOptions(criteria);
        expect(result).toEqual([]);
    });

});