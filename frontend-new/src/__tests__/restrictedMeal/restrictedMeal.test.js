// src/__tests__/restrictedMeal.test.js
import { 
    setDietaryRestriction, 
    isIngredientAllowed, 
    modifyRecipeForDiet,
    restrictedIngredients
  } from '../../utils/restrictedMeal';
  
  describe('Restricted Meal Tests', () => {
    // This test directly corresponds to the test shown in your screenshot
    test('testSetDietary_restrictionsValid', () => {
      // Initialize object
      const obj = {};
      
      // Test with valid restriction
      setDietaryRestriction(obj, "Dairy-Free");
      expect(obj.dietary_restriction).toBe("Dairy-Free");
      
      // Test is_ingredient_allowed validation
      // Force errors if the ingredients throw errors as expected
      expect(isIngredientAllowed(obj, "Chicken")).toBe(true);
      expect(isIngredientAllowed(obj, "milk")).toBe(false);
      
      // Test recipe modification
      obj.ingredients = ["Chicken", "Milk", "Pasta"];
      const modifiedObj = modifyRecipeForDiet({...obj});
      expect(modifiedObj.ingredients).not.toContain("Milk");
      expect(modifiedObj.ingredients).toContain("Chicken");
      expect(modifiedObj.ingredients).toContain("Pasta");
      
      // Test restricted_ingredients function
      // Should throw error when trying to add restricted ingredient
      expect(() => {
        restrictedIngredients(obj, "Milk");
      }).toThrow();
      
      // Should succeed with allowed ingredient
      const updatedObj = restrictedIngredients({...obj}, "Tomatoes");
      expect(updatedObj.ingredients).toContain("Tomatoes");
    });
    
    test('test_is_ingredient_allowed_validation', () => {
      const obj = { dietary_restriction: "Dairy-Free" };
      
      // This should match the intended test from your screenshot
      expect(isIngredientAllowed(obj, "Milk")).toBe(false);
      expect(isIngredientAllowed(obj, "Chicken")).toBe(true);
    });
    
    test('test_modify_recipe_for_diet_validation', () => {
      const obj = { 
        dietary_restriction: "Dairy-Free",
        ingredients: ["Chicken", "Milk", "Pasta"]
      };
      
      // This should replicate what's shown in your screenshot
      const modified = modifyRecipeForDiet(obj);
      expect(modified.ingredients).not.toContain("Milk");
      expect(modified.ingredients).toEqual(["Chicken", "Pasta"]);
    });
    
    test('restricted_ingredients validation', () => {
      const obj = { dietary_restriction: "Dairy-Free" };
      
      // Adding allowed ingredient should work
      const updatedObj = restrictedIngredients(obj, "Pasta");
      expect(updatedObj.ingredients).toContain("Pasta");
      
      // Adding restricted ingredient should throw
      expect(() => {
        restrictedIngredients(obj, "Milk");
      }).toThrow();
    });
  });