// src/components/MealPlanner/MealPlanner.js
import React, { useState } from 'react';
import './MealPlanner.css';

const MealPlanner = ({ onGoBack }) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    lifestyle: '',
    dietaryRestrictions: [],
    mealPreferences: [],
    cookingTime: '',
    budget: ''
  });
  const [mealPlan, setMealPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Lifestyle options
  const lifestyleOptions = [
    { id: 'college', label: 'College Student', icon: '🎓' },
    { id: 'athlete', label: 'Athlete/Active', icon: '🏃‍♂️' },
    { id: 'professional', label: 'Working Professional', icon: '💼' },
    { id: 'busy', label: 'Busy Parent', icon: '👨‍👩‍👧‍👦' },
    { id: 'senior', label: 'Senior/Retiree', icon: '🧓' }
  ];

  // Dietary restriction options
  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'glutenFree', label: 'Gluten-Free' },
    { id: 'dairyFree', label: 'Dairy-Free' },
    { id: 'nutFree', label: 'Nut-Free' },
    { id: 'lowCarb', label: 'Low-Carb' },
    { id: 'keto', label: 'Keto' },
    { id: 'paleo', label: 'Paleo' }
  ];

  // Meal preference options
  const preferenceOptions = [
    { id: 'quickMeals', label: 'Quick & Easy Meals' },
    { id: 'mealPrep', label: 'Batch Cooking/Meal Prep' },
    { id: 'highProtein', label: 'High-Protein Meals' },
    { id: 'budgetFriendly', label: 'Budget-Friendly' },
    { id: 'comfortFood', label: 'Comfort Food' },
    { id: 'international', label: 'International Cuisine' },
    { id: 'healthyOptions', label: 'Healthy Options' }
  ];

  // Cooking time options
  const cookingTimeOptions = [
    { id: 'minimal', label: 'Minimal (15 min or less)' },
    { id: 'moderate', label: 'Moderate (15-30 min)' },
    { id: 'standard', label: 'Standard (30-45 min)' },
    { id: 'extended', label: 'I enjoy cooking (45+ min)' }
  ];

  // Budget options
  const budgetOptions = [
    { id: 'tight', label: 'Tight budget' },
    { id: 'moderate', label: 'Moderate budget' },
    { id: 'flexible', label: 'Flexible budget' }
  ];

  // Handle lifestyle selection
  const selectLifestyle = (lifestyle) => {
    setUserData({ ...userData, lifestyle });
    nextStep();
  };

  // Handle dietary restriction selection (multiple)
  const toggleDietaryRestriction = (restriction) => {
    setUserData(prevData => {
      const restrictions = [...prevData.dietaryRestrictions];
      const index = restrictions.indexOf(restriction);
      
      if (index === -1) {
        restrictions.push(restriction);
      } else {
        restrictions.splice(index, 1);
      }
      
      return { ...prevData, dietaryRestrictions: restrictions };
    });
  };

  // Handle preference selection (multiple)
  const togglePreference = (preference) => {
    setUserData(prevData => {
      const preferences = [...prevData.mealPreferences];
      const index = preferences.indexOf(preference);
      
      if (index === -1) {
        preferences.push(preference);
      } else {
        preferences.splice(index, 1);
      }
      
      return { ...prevData, mealPreferences: preferences };
    });
  };

  // Set cooking time preference
  const setCookingTime = (time) => {
    setUserData({ ...userData, cookingTime: time });
    nextStep();
  };

  // Set budget preference
  const setBudget = (budget) => {
    setUserData({ ...userData, budget });
    generateMealPlan();
  };

  // Move to next step
  const nextStep = () => {
    setStep(prevStep => prevStep + 1);
  };

  // Move to previous step
  const prevStep = () => {
    setStep(prevStep => prevStep - 1);
  };

  // Generate meal plan
  const generateMealPlan = () => {
    setIsLoading(true);
    
    // This would normally call an API to get a personalized meal plan
    // For now, we'll generate a mock meal plan
    setTimeout(() => {
      const mockMealPlan = generateMockMealPlan();
      setMealPlan(mockMealPlan);
      setIsLoading(false);
      nextStep();
    }, 2000);
  };

  // Mock meal plan generator (replace with actual API call in production)
  const generateMockMealPlan = () => {
    // Adjust meal types based on user preferences
    let breakfastOptions = [
      "Overnight Oats with Berries",
      "Avocado Toast with Poached Egg",
      "Greek Yogurt Parfait",
      "Protein Smoothie Bowl",
      "Whole Grain Cereal with Fruit",
      "Breakfast Burrito",
      "Veggie Omelet"
    ];
    
    let lunchOptions = [
      "Quinoa Salad with Chickpeas",
      "Turkey and Avocado Wrap",
      "Mediterranean Grain Bowl",
      "Lentil Soup with Vegetables",
      "Tuna Salad Sandwich",
      "Chicken Caesar Salad",
      "Black Bean Burrito"
    ];
    
    let dinnerOptions = [
      "Baked Salmon with Roasted Vegetables",
      "Whole Wheat Pasta with Tomato Sauce",
      "Stir-Fry with Brown Rice",
      "Sheet Pan Chicken and Vegetables",
      "Bean and Vegetable Chili",
      "Turkey Meatballs with Zucchini Noodles",
      "Vegetable Curry with Rice"
    ];
    
    // If user is vegetarian or vegan, filter out non-compliant options
    if (userData.dietaryRestrictions.includes('vegetarian')) {
      lunchOptions = lunchOptions.filter(meal => !meal.includes('Turkey') && !meal.includes('Tuna') && !meal.includes('Chicken'));
      dinnerOptions = dinnerOptions.filter(meal => !meal.includes('Salmon') && !meal.includes('Chicken') && !meal.includes('Turkey'));
    }
    
    if (userData.dietaryRestrictions.includes('vegan')) {
      breakfastOptions = breakfastOptions.filter(meal => !meal.includes('Egg') && !meal.includes('Yogurt'));
      lunchOptions = lunchOptions.filter(meal => !meal.includes('Turkey') && !meal.includes('Tuna') && !meal.includes('Chicken'));
      dinnerOptions = dinnerOptions.filter(meal => !meal.includes('Salmon') && !meal.includes('Chicken') && !meal.includes('Turkey'));
    }
    
    // Generate a week's worth of meals
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return days.map(day => {
      return {
        day,
        meals: {
          breakfast: breakfastOptions[Math.floor(Math.random() * breakfastOptions.length)],
          lunch: lunchOptions[Math.floor(Math.random() * lunchOptions.length)],
          dinner: dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)]
        }
      };
    });
  };

  // Go back to home page
  const goToHome = () => {
    if (onGoBack) {
      onGoBack();
    }
  };

  // Render different steps based on current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="meal-planner-step">
            <h2>What best describes your lifestyle?</h2>
            <div className="option-grid">
              {lifestyleOptions.map(option => (
                <button
                  key={option.id}
                  className={`lifestyle-option ${userData.lifestyle === option.id ? 'selected' : ''}`}
                  onClick={() => selectLifestyle(option.id)}
                >
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="meal-planner-step">
            <h2>Any dietary restrictions?</h2>
            <p className="step-description">Select all that apply</p>
            <div className="option-grid">
              {dietaryOptions.map(option => (
                <button
                  key={option.id}
                  className={`dietary-option ${userData.dietaryRestrictions.includes(option.id) ? 'selected' : ''}`}
                  onClick={() => toggleDietaryRestriction(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="navigation-buttons">
              <button className="back-button" onClick={prevStep}>Back</button>
              <button className="next-button" onClick={nextStep}>Continue</button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="meal-planner-step">
            <h2>What are you looking for in your meals?</h2>
            <p className="step-description">Select all that apply</p>
            <div className="option-grid">
              {preferenceOptions.map(option => (
                <button
                  key={option.id}
                  className={`preference-option ${userData.mealPreferences.includes(option.id) ? 'selected' : ''}`}
                  onClick={() => togglePreference(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="navigation-buttons">
              <button className="back-button" onClick={prevStep}>Back</button>
              <button className="next-button" onClick={nextStep}>Continue</button>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="meal-planner-step">
            <h2>How much time do you have for cooking?</h2>
            <div className="option-list">
              {cookingTimeOptions.map(option => (
                <button
                  key={option.id}
                  className={`time-option ${userData.cookingTime === option.id ? 'selected' : ''}`}
                  onClick={() => setCookingTime(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="navigation-buttons">
              <button className="back-button" onClick={prevStep}>Back</button>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="meal-planner-step">
            <h2>What's your grocery budget like?</h2>
            <div className="option-list">
              {budgetOptions.map(option => (
                <button
                  key={option.id}
                  className={`budget-option ${userData.budget === option.id ? 'selected' : ''}`}
                  onClick={() => setBudget(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="navigation-buttons">
              <button className="back-button" onClick={prevStep}>Back</button>
            </div>
          </div>
        );
      
      case 6:
        return (
          <div className="meal-planner-result">
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Creating your personalized meal plan...</p>
              </div>
            ) : (
              <>
                <h2>Your Weekly Meal Plan</h2>
                <p className="plan-description">
                  Based on your {getLifestyleLabel()} lifestyle
                  {userData.dietaryRestrictions.length > 0 && ` with ${userData.dietaryRestrictions.join(', ')} options`}
                </p>
                
                <div className="meal-plan-container">
                  {mealPlan.map((dayPlan, index) => (
                    <div key={index} className="day-plan">
                      <h3 className="day-header">{dayPlan.day}</h3>
                      <div className="meals">
                        <div className="meal">
                          <span className="meal-title">Breakfast</span>
                          <span className="meal-item">{dayPlan.meals.breakfast}</span>
                        </div>
                        <div className="meal">
                          <span className="meal-title">Lunch</span>
                          <span className="meal-item">{dayPlan.meals.lunch}</span>
                        </div>
                        <div className="meal">
                          <span className="meal-title">Dinner</span>
                          <span className="meal-item">{dayPlan.meals.dinner}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="action-buttons">
                  <button className="back-to-chat-btn" onClick={goToHome}>Back to Recipe Assistant</button>
                  <button className="save-plan-btn">Save This Plan</button>
                </div>
              </>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  // Helper function to get lifestyle label
  const getLifestyleLabel = () => {
    const lifestyle = lifestyleOptions.find(option => option.id === userData.lifestyle);
    return lifestyle ? lifestyle.label.toLowerCase() : '';
  };

  return (
    <div className="meal-planner-container">
      <header className="meal-planner-header">
        <h1>Weekly Meal Planner</h1>
        <button className="close-btn" onClick={goToHome}>×</button>
      </header>
      
      {step < 6 && (
        <div className="progress-indicator">
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(step / 5) * 100}%` }}></div>
          </div>
          <span className="progress-text">Step {step} of 5</span>
        </div>
      )}
      
      <div className="meal-planner-content">
        {renderStep()}
      </div>
    </div>
  );
};

export default MealPlanner;