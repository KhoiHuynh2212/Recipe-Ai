from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Sample recipe data
sample_recipes = [
    {
        "id": 1,
        "name": "Pancakes",
        "ingredients": ["flour", "eggs", "milk", "butter"],
        "instructions": ["Mix ingredients", "Cook on pan", "Serve with syrup"],
        "cookTime": 15,
        "servings": 4
    },
    {
        "id": 2,
        "name": "Spaghetti",
        "ingredients": ["pasta", "tomato sauce", "garlic", "herbs"],
        "instructions": ["Boil pasta", "Heat sauce", "Combine and serve"],
        "cookTime": 20,
        "servings": 2
    }
]


@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "online",
        "message": "AI Recipe Backend is running"
    })


@app.route('/api/recipes', methods=['GET'])
def get_recipes():
    """Get all recipes"""
    return jsonify(sample_recipes)


@app.route('/api/recipes/<int:recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    """Get a specific recipe by ID"""
    for recipe in sample_recipes:
        if recipe['id'] == recipe_id:
            return jsonify(recipe)
    return jsonify({"error": "Recipe not found"}), 404


@app.route('/api/generate', methods=['POST'])
def generate_recipe():
    """Generate a recipe based on inputs"""
    try:
        data = request.json

        # This is where you would call your ML model
        # For now, we'll return a mock response

        ingredients = data.get('ingredients', [])

        response = {
            "name": "Generated Recipe",
            "ingredients": ingredients,
            "instructions": [
                "Step 1: Prepare ingredients",
                "Step 2: Cook according to preference",
                "Step 3: Enjoy your meal"
            ],
            "cookTime": 30,
            "servings": 2
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Get port from environment variable or use 5000 as default
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

