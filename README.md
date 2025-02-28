AI Recipe Cooking App 🍳🤖
Welcome to the AI Recipe Cooking App! This application uses artificial intelligence to generate personalized recipes based on user inputs, such as dietary preferences, available ingredients, and cooking time. Whether you're a beginner or a seasoned chef, this app will help you create delicious meals at home.
Project Structure
This project follows a modern microservices architecture:
CopyRecipe-AI/
├── .github/workflows/         # CI/CD pipeline configuration
│   └── main.yml               # GitHub Actions workflow
├── backend/                   # Node.js/Express & Python API server
│   ├── src/                   # Backend source code
│   │   ├── api/               # API routes
│   │   ├── models/            # Data models
│   │   └── services/          # Business logic
│   ├── app.py                 # Python Flask application
│   └── requirements.txt       # Python dependencies
├── frontend/src/              # React.js application
│   ├── components/            # Reusable UI components
│   ├── pages/                 # Page components
│   ├── services/              # API client services
│   ├── styles/                # CSS and styling
│   └── utils/                 # Utility functions
└── ml/                        # Machine Learning model
    ├── data/                  # Training and test data
    ├── models/                # Trained models
    └── training/              # Training scripts
Features ✨

Personalized Recipe Recommendations: Get recipes tailored to your dietary preferences (e.g., vegan, gluten-free) and available ingredients.
Ingredient Parsing: Input the ingredients you have at home, and the app will suggest recipes you can make.
User Profiles: Save your preferences, cooking history, and favorite recipes.
Step-by-Step Instructions: Easy-to-follow cooking instructions for every recipe.
AI-Powered Suggestions: Discover new recipes based on your cooking habits and preferences.
Responsive Design: Works seamlessly on desktop, tablet, and mobile devices.

Technologies Used 💻
Frontend

React.js: A JavaScript library for building user interfaces.
Tailwind CSS: A utility-first CSS framework for styling.
Axios: For making HTTP requests to the backend.

Backend

Python/Flask: For the AI model API.
Node.js/Express: For user management and authentication.
MongoDB: A NoSQL database for storing user profiles and recipes.

AI/ML

Python: For building the AI/ML models.
TensorFlow/PyTorch: Open-source machine learning frameworks.
Natural Language Processing (NLP): For parsing user inputs and understanding ingredients.

CI/CD Pipeline

GitHub Actions: For continuous integration and deployment.
Render: For hosting the backend API.
GitHub Pages: For hosting the frontend application.

Installation and Setup
Prerequisites

Node.js and npm
Python 3.8+
Git

Local Development Setup

Clone the repository
Copygit clone https://github.com/KhoiHuynh2212/Recipe-AI.git
cd Recipe-AI

Backend Setup
Copycd backend
pip install -r requirements.txt
python app.py
The backend will be available at http://localhost:5000
Frontend Setup
Copycd frontend
npm install
npm start
The frontend will be available at http://localhost:3000

Deployment
This project uses GitHub Actions for CI/CD pipeline:

Frontend: Automatically deployed to GitHub Pages
Backend: Automatically deployed to Render
AI Model: Automatically deployed to Render

The deployment is triggered automatically when changes are pushed to the main branch.
API Documentation
Recipe Generation Endpoint
CopyPOST /api/generate
Request Body:
jsonCopy{
  "ingredients": ["chicken", "rice", "onions"],
  "preferences": {
    "dietary": ["gluten-free"],
    "time": ["quick"]
  }
}
Response:
jsonCopy{
  "name": "Quick Chicken Stir Fry",
  "ingredients": ["2 chicken breasts", "1 cup rice", "1 onion"],
  "instructions": ["Step 1: ...", "Step 2: ..."],
  "cookTime": 20,
  "servings": 2
}
Contributing

Fork the repository
Create a feature branch: git checkout -b new-feature
Commit your changes: git commit -m 'Add new feature'
Push to the branch: git push origin new-feature
Submit a pull request

License
This project is licensed under the MIT License - see the LICENSE file for details.
Contact
Your Name - khoihuynh2212@gmail.com
Project Link: https://github.com/KhoiHuynh2212/Recipe-AI