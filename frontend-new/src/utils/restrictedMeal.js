// src/utils/restrictedMeal.js

/**
 * Sets dietary restriction for a recipe
 * Based on the implementation from the screenshot
 * 
 * @param {Object} self - Recipe object
 * @param {string} restriction - Dietary restriction to apply
 * @returns {string} - The applied restriction
 * @throws {Error} - If restriction is empty or "None"
 */
export function setDietaryRestriction(self, restriction) {
    if (restriction === null || restriction === "" || restriction === "None") {
      throw new Error("Dietary restriction cannot be empty or None.");
    }
    self.dietary_restriction = restriction;
    return restriction;
  }
  
  /**
   * Gets the current dietary restriction
   * 
   * @param {Object} self - Recipe object
   * @returns {string} - Current dietary restriction
   */
  export function getDietaryRestriction(self) {
    return self.dietary_restriction;
  }
  
  /**
   * Checks if an ingredient is allowed with the current dietary restriction
   * 
   * @param {Object} self - Recipe object
   * @param {string} ingredient_name - Ingredient to check
   * @returns {boolean} - Whether the ingredient is allowed
   */
  export function isIngredientAllowed(self, ingredient_name) {
    // For demonstration, if restriction == "Dairy-Free" -> "milk" is not allowed
    if (self.dietary_restriction === "Dairy-Free" && 
        ingredient_name.toLowerCase() === "milk") {
      return false;
    }
    return true;
  }
  
  /**
   * Modifies a recipe to fit dietary restrictions
   * 
   * @param {Object} self - Recipe object
   * @returns {Object} - Modified recipe
   */
  export function modifyRecipeForDiet(self) {
    // For demonstration, remove "Milk" if "Dairy-Free"
    if (self.dietary_restriction === "Dairy-Free") {
      if (self.ingredients) {
        self.ingredients = self.ingredients.filter(ingredient => 
          ingredient.toLowerCase() !== "milk"
        );
      }
    }
    return self;
  }
  
  /**
   * Checks if a recipe contains a specific ingredient
   * 
   * @param {Object} self - Recipe object
   * @param {string} ingredient_name - Ingredient to look for
   * @returns {boolean} - Whether the ingredient is present
   */
  export function containsIngredient(self, ingredient_name) {
    return self.ingredients && self.ingredients.some(ingredient => 
      ingredient.toLowerCase() === ingredient_name.toLowerCase()
    );
  }
  
  /**
   * Adds an ingredient to a recipe, respecting dietary restrictions
   * 
   * @param {Object} recipe - Recipe to add ingredient to
   * @param {string} ingredientName - Ingredient to add
   * @returns {Object} - Updated recipe
   * @throws {Error} - If ingredient is not allowed with the restriction
   */
  export function restrictedIngredients(recipe, ingredientName) {
    // Check if ingredient is allowed with current restriction
    if (recipe.dietary_restriction && !isIngredientAllowed(recipe, ingredientName)) {
      throw new Error(`Ingredient ${ingredientName} is not allowed with ${recipe.dietary_restriction} restriction.`);
    }
    
    // Add the ingredient
    if (!recipe.ingredients) {
      recipe.ingredients = [];
    }
    recipe.ingredients.push(ingredientName);
    
    return recipe;
  }
  
  // Default export for convenience, alongside named exports
  export default {
    setDietaryRestriction,
    getDietaryRestriction,
    isIngredientAllowed,
    modifyRecipeForDiet,
    containsIngredient,
    restrictedIngredients
  };