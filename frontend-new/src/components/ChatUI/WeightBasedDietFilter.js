import React, { useState, useEffect } from 'react';
import './WeightBasedDietFilter.css';

const WeightBasedDietFilter = ({ onRecommendationsChange }) => {
    // User stats
    const [weight, setWeight] = useState('');
    const [weightUnit, setWeightUnit] = useState('kg');
    const [height, setHeight] = useState('');
    const [heightUnit, setHeightUnit] = useState('cm');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [activityLevel, setActivityLevel] = useState('moderate');
    const [goal, setGoal] = useState('maintain');
    
    // UI states
    const [showResults, setShowResults] = useState(false);
    const [recommendations, setRecommendations] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Activity level options
    const activityOptions = [
        { value: 'sedentary', label: 'Sedentary (little or no exercise)', multiplier: 1.2 },
        { value: 'light', label: 'Lightly active (light exercise 1-3 days/week)', multiplier: 1.375 },
        { value: 'moderate', label: 'Moderately active (moderate exercise 3-5 days/week)', multiplier: 1.55 },
        { value: 'active', label: 'Very active (hard exercise 6-7 days/week)', multiplier: 1.725 },
        { value: 'veryActive', label: 'Super active (very hard exercise & physical job)', multiplier: 1.9 }
    ];

    // Goal options
    const goalOptions = [
        { value: 'lose', label: 'Lose weight' },
        { value: 'maintain', label: 'Maintain weight' },
        { value: 'gain', label: 'Gain weight' }
    ];

    // Convert weight to kg if needed
    const getWeightInKg = () => {
        const weightValue = parseFloat(weight);
        if (isNaN(weightValue)) return 0;
        return weightUnit === 'lbs' ? weightValue * 0.453592 : weightValue;
    };

    // Convert height to cm if needed
    const getHeightInCm = () => {
        const heightValue = parseFloat(height);
        if (isNaN(heightValue)) return 0;
        return heightUnit === 'in' ? heightValue * 2.54 : heightValue;
    };

    // Calculate BMI
    const calculateBMI = () => {
        const weightKg = getWeightInKg();
        const heightCm = getHeightInCm();
        
        if (weightKg <= 0 || heightCm <= 0) return 0;
        
        // BMI = weight(kg) / height(m)²
        const heightM = heightCm / 100;
        return weightKg / (heightM * heightM);
    };

    // Calculate daily calorie needs
    const calculateCalories = () => {
        const weightKg = getWeightInKg();
        const heightCm = getHeightInCm();
        const ageValue = parseInt(age);
        
        if (weightKg <= 0 || heightCm <= 0 || isNaN(ageValue)) return 0;
        
        // Base metabolic rate (BMR) using Mifflin-St Jeor Equation
        let bmr = 0;
        if (gender === 'male') {
            bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageValue + 5;
        } else if (gender === 'female') {
            bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageValue - 161;
        } else {
            // If gender not specified, use average
            const maleBmr = 10 * weightKg + 6.25 * heightCm - 5 * ageValue + 5;
            const femaleBmr = 10 * weightKg + 6.25 * heightCm - 5 * ageValue - 161;
            bmr = (maleBmr + femaleBmr) / 2;
        }
        
        // Apply activity multiplier
        const activity = activityOptions.find(opt => opt.value === activityLevel);
        const tdee = bmr * (activity ? activity.multiplier : 1.55);
        
        // Adjust based on goal
        switch (goal) {
            case 'lose':
                return tdee - 500; // 500 calorie deficit
            case 'gain':
                return tdee + 500; // 500 calorie surplus
            default:
                return tdee; // Maintain weight
        }
    };

    // Generate nutrition recommendations based on calculated needs
    const generateRecommendations = () => {
        const dailyCalories = calculateCalories();
        const bmi = calculateBMI();
        
        if (dailyCalories <= 0) return null;
        
        // Macronutrient distribution
        let proteinPercentage, carbPercentage, fatPercentage;
        
        // Adjust macros based on goal
        switch (goal) {
            case 'lose':
                proteinPercentage = 0.35; // Higher protein for satiety and muscle preservation
                carbPercentage = 0.35;
                fatPercentage = 0.30;
                break;
            case 'gain':
                proteinPercentage = 0.30;
                carbPercentage = 0.45; // Higher carbs for energy
                fatPercentage = 0.25;
                break;
            default:
                proteinPercentage = 0.30;
                carbPercentage = 0.40;
                fatPercentage = 0.30;
        }
        
        // Calculate grams of each macronutrient
        // Protein: 4 calories per gram
        // Carbs: 4 calories per gram
        // Fat: 9 calories per gram
        const proteinGrams = Math.round((dailyCalories * proteinPercentage) / 4);
        const carbGrams = Math.round((dailyCalories * carbPercentage) / 4);
        const fatGrams = Math.round((dailyCalories * fatPercentage) / 9);
        
        // BMI categories
        let bmiCategory, bmiMessage;
        if (bmi < 18.5) {
            bmiCategory = 'Underweight';
            bmiMessage = 'Consider consulting with a healthcare provider about healthy weight gain.';
        } else if (bmi < 25) {
            bmiCategory = 'Normal weight';
            bmiMessage = 'You are in a healthy weight range.';
        } else if (bmi < 30) {
            bmiCategory = 'Overweight';
            bmiMessage = 'Consider focusing on a balanced diet and regular exercise.';
        } else {
            bmiCategory = 'Obese';
            bmiMessage = 'Consider consulting with a healthcare provider about a weight management plan.';
        }
        
        // Recommended ingredients based on goal
        const recommendedIngredients = {
            protein: [],
            carbs: [],
            fats: [],
            general: []
        };
        
        // Protein recommendations
        recommendedIngredients.protein = [
            'Chicken breast',
            'Turkey',
            'Lean beef',
            'Fish (salmon, tuna)',
            'Eggs',
            'Greek yogurt',
            'Cottage cheese',
            'Tofu',
            'Tempeh',
            'Legumes (beans, lentils)'
        ];
        
        // Carb recommendations
        recommendedIngredients.carbs = [
            'Quinoa',
            'Brown rice',
            'Sweet potatoes',
            'Oats',
            'Fruits',
            'Whole wheat bread',
            'Whole grain pasta',
            'Beans and legumes',
            'Vegetables'
        ];
        
        // Healthy fats
        recommendedIngredients.fats = [
            'Avocados',
            'Olive oil',
            'Nuts (almonds, walnuts)',
            'Seeds (flax, chia)',
            'Fatty fish',
            'Nut butters',
            'Coconut oil (in moderation)'
        ];
        
        // Goal-specific tweaks
        if (goal === 'lose') {
            recommendedIngredients.general = [
                'Focus on high-fiber vegetables to feel fuller',
                'Include protein with every meal',
                'Choose water or unsweetened beverages',
                'Include metabolism-boosting spices like cayenne pepper',
                'Incorporate leafy greens in most meals'
            ];
        } else if (goal === 'gain') {
            recommendedIngredients.general = [
                'Include calorie-dense foods like nuts and nut butters',
                'Add healthy oils to meals',
                'Consider smoothies with added protein and healthy fats',
                'Eat more frequent meals',
                'Include starchy vegetables like potatoes'
            ];
        } else {
            recommendedIngredients.general = [
                'Focus on balanced meals',
                'Eat a variety of colorful fruits and vegetables',
                'Stay hydrated with water',
                'Include a mix of plant and animal proteins',
                'Incorporate healthy fats in moderation'
            ];
        }
        
        return {
            dailyCalories: Math.round(dailyCalories),
            macros: {
                protein: {
                    percentage: Math.round(proteinPercentage * 100),
                    grams: proteinGrams,
                    calories: proteinGrams * 4
                },
                carbs: {
                    percentage: Math.round(carbPercentage * 100),
                    grams: carbGrams,
                    calories: carbGrams * 4
                },
                fat: {
                    percentage: Math.round(fatPercentage * 100),
                    grams: fatGrams,
                    calories: fatGrams * 9
                }
            },
            bmi: {
                value: Math.round(bmi * 10) / 10,
                category: bmiCategory,
                message: bmiMessage
            },
            recommendedIngredients: recommendedIngredients
        };
    };

    const handleCalculate = (e) => {
        e.preventDefault();
        
        const results = generateRecommendations();
        setRecommendations(results);
        setShowResults(true);
        
        // Notify parent component if needed
        if (onRecommendationsChange && results) {
            onRecommendationsChange(results);
        }
    };

    const toggleForm = () => {
        setShowForm(!showForm);
        // If hiding the form, also hide results
        if (showForm) {
            setShowResults(false);
        }
    };

    return (
        <div className="weight-based-diet-filter">
            <div className="filter-card-header">
                <h3>Personalized Nutrition Recommendations</h3>
                <button 
                    className="toggle-form-btn"
                    onClick={toggleForm}
                >
                    {showForm ? 'Hide Calculator' : 'Get Personalized Recommendations'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCalculate} className="nutrition-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Weight</label>
                            <div className="input-with-select">
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="Your weight"
                                    min="0"
                                    required
                                />
                                <select 
                                    value={weightUnit} 
                                    onChange={(e) => setWeightUnit(e.target.value)}
                                >
                                    <option value="kg">kg</option>
                                    <option value="lbs">lbs</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Height</label>
                            <div className="input-with-select">
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    placeholder="Your height"
                                    min="0"
                                    required
                                />
                                <select 
                                    value={heightUnit} 
                                    onChange={(e) => setHeightUnit(e.target.value)}
                                >
                                    <option value="cm">cm</option>
                                    <option value="in">in</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Age</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="Your age"
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Gender (for caloric calculation)</label>
                            <select 
                                value={gender} 
                                onChange={(e) => setGender(e.target.value)}
                                required
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Prefer not to say</option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label>Activity Level</label>
                            <select 
                                value={activityLevel} 
                                onChange={(e) => setActivityLevel(e.target.value)}
                            >
                                {activityOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label>Goal</label>
                            <div className="goal-buttons">
                                {goalOptions.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className={goal === option.value ? 'goal-btn selected' : 'goal-btn'}
                                        onClick={() => setGoal(option.value)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="calculate-btn">
                        Calculate Nutrition Plan
                    </button>
                </form>
            )}

            {showResults && recommendations && (
                <div className="nutrition-results">
                    <div className="results-header">
                        <h3>Your Personalized Nutrition Plan</h3>
                        <div className="bmi-badge" data-category={recommendations.bmi.category.toLowerCase().replace(' ', '-')}>
                            BMI: {recommendations.bmi.value} ({recommendations.bmi.category})
                        </div>
                    </div>

                    <div className="calorie-info">
                        <div className="calorie-circle">
                            <div className="calorie-number">{recommendations.dailyCalories}</div>
                            <div className="calorie-label">calories/day</div>
                        </div>

                        <div className="bmi-message">
                            <p>{recommendations.bmi.message}</p>
                        </div>
                    </div>

                    <div className="macros-container">
                        <h4>Recommended Macronutrients</h4>
                        <div className="macro-bars">
                            <div className="macro-bar protein" style={{width: `${recommendations.macros.protein.percentage}%`}}>
                                {recommendations.macros.protein.percentage}%
                            </div>
                            <div className="macro-bar carbs" style={{width: `${recommendations.macros.carbs.percentage}%`}}>
                                {recommendations.macros.carbs.percentage}%
                            </div>
                            <div className="macro-bar fat" style={{width: `${recommendations.macros.fat.percentage}%`}}>
                                {recommendations.macros.fat.percentage}%
                            </div>
                        </div>
                        <div className="macro-legend">
                            <div className="legend-item">
                                <span className="legend-color protein"></span>
                                <span className="legend-text">Protein: {recommendations.macros.protein.grams}g</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-color carbs"></span>
                                <span className="legend-text">Carbs: {recommendations.macros.carbs.grams}g</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-color fat"></span>
                                <span className="legend-text">Fat: {recommendations.macros.fat.grams}g</span>
                            </div>
                        </div>
                    </div>

                    <div className="ingredients-recommendations">
                        <h4>Recommended Foods & Ingredients</h4>
                        <div className="ingredients-grid">
                            <div className="ingredient-category">
                                <h5>Protein Sources</h5>
                                <ul className="ingredients-list">
                                    {recommendations.recommendedIngredients.protein.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="ingredient-category">
                                <h5>Carbohydrate Sources</h5>
                                <ul className="ingredients-list">
                                    {recommendations.recommendedIngredients.carbs.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="ingredient-category">
                                <h5>Healthy Fats</h5>
                                <ul className="ingredients-list">
                                    {recommendations.recommendedIngredients.fats.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="general-tips">
                            <h5>Tips for Your {goal === 'lose' ? 'Weight Loss' : goal === 'gain' ? 'Weight Gain' : 'Weight Maintenance'} Goal</h5>
                            <ul className="tips-list">
                                {recommendations.recommendedIngredients.general.map((tip, index) => (
                                    <li key={index}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeightBasedDietFilter;