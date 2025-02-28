AI Recipe Cooking App
Welcome to the AI Recipe Cooking App! This app uses artificial intelligence to generate personalized recipes based on user inputs, such as dietary preferences, available ingredients, and cooking time. Whether you're a beginner or a seasoned chef, this app will help you create delicious meals at home.

Table of Contents

Features
Technologies Used
Installation
Usage
Project Structure
Development Workflow
Testing
Deployment
Contributing
License
Contact


Features 

Personalized Recipe Recommendations: Get recipes tailored to your dietary preferences (e.g., vegan, gluten-free) and available ingredients.
Ingredient Parsing: Input the ingredients you have at home, and the app will suggest recipes you can make.
User Profiles: Save your preferences, cooking history, and favorite recipes.
Step-by-Step Instructions: Easy-to-follow cooking instructions for every recipe.
AI-Powered Suggestions: Discover new recipes based on your cooking habits and preferences.
Responsive Design: Works seamlessly on desktop, tablet, and mobile devices.


Technologies Used 
Frontend

React.js: A JavaScript library for building user interfaces.
CSS with Inline Styles: Simple styling approach for components.
Axios: For making HTTP requests to the backend.

Backend

Node.js: A JavaScript runtime for building the server.
Express.js: A web framework for Node.js.
MongoDB: A NoSQL database for storing user profiles and recipes.
Mongoose: An ODM (Object Data Modeling) library for MongoDB.

AI/ML

Python: For building the AI/ML models.
TensorFlow: An open-source machine learning framework.
Natural Language Processing (NLP): For parsing user inputs and understanding ingredients.

Version Control & Collaboration

Git: For version control.
GitHub: For hosting the repository and collaboration.

Deployment

Docker: For containerizing the application.
Free Cloud Hosting Options: For deploying the application.


Installation 🛠️
Prerequisites
Before installing this project, ensure you have the following installed on your system:

Node.js & npm (Download from https://nodejs.org/)
Python 3.8+ (Download from https://www.python.org/downloads/)
pip (Python package manager, comes with Python)
PyTorch (Optional, for AI model - Download from https://pytorch.org/)
Virtual Environment (optional but recommended for Python)

Frontend Installation
# Clone the Repository
git clone https://github.com/Group-M/AiRecipe-project.git
cd AiRecipe-project

# Install frontend dependencies
cd frontend
npm install

cd backend
npm install

AI Model Installation
cd ai_model
# Create virtual environment
python3 -m venv venv
# Activate it (MacOS/Linux)
source venv/bin/activate
# OR Activate it (Windows)
venv\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

Usage 🍽️
Running the Frontend
cd frontend
npm start
This will start the development server and open the app in your browser at http://localhost:3000.
Running the Backend
cd backend
npm start
The backend server will run on http://localhost:5000.
Running the AI Model
bashCopycd ai_model
python app.py
Features

Create a User Profile: Sign up and input your dietary preferences and restrictions.
Input Ingredients: Enter the ingredients you have at home.
Get Recipes: The app will generate personalized recipes based on your inputs.
Cook and Enjoy: Follow the step-by-step instructions to prepare your meal.


Project Structure
CopyAiRecipe-project/
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/                # Source files
│   │   ├── components/     # React components
│   │   ├── App.js          # Main App component
│   │   └── index.js        # Entry point
├── backend/                # Node.js backend
│   ├── controllers/        # Request handlers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── server.js           # Entry point
└── ai_model/               # Python AI model
    ├── data/               # Training data
    ├── models/             # AI models
    └── app.py              # Flask API

Development Workflow

Set up your development environment following the installation instructions.
Create feature branches from the main branch for new features.
Implement and test your changes.
Submit pull requests for review.
Merge approved changes into the main branch.


Testing

Frontend: Run tests with npm test in the frontend directory.
Backend: Run tests with npm test in the backend directory.
AI Model: Run tests with pytest tests/ in the ai_model directory.


Deployment
This project is configured to use free cloud hosting options:

Frontend: Deploy to Netlify or Vercel
Backend: Deploy to Render or Railway
Database: Use MongoDB Atlas free tier
AI Model: Deploy to Render or Heroku

Detailed deployment instructions will be added in the future.

Contributing Guidelines
We welcome contributions to the AI Recipe Cooking App! Here's how to contribute:

Fork the repository and clone it to your local machine.
Create a new branch for your feature or fix.
Commit your changes with a descriptive message.
Push your changes to your fork.
Create a Pull Request to merge into the main branch.
Code review: We'll review and provide feedback. Update as needed.


License
This project is licensed under the OU COMPUTER SCIENCE License.
You are free to use, modify, and distribute the code, with the following conditions:

Include the original copyright notice and license in all copies or substantial portions of the software.
The software is provided "as is" without warranty of any kind.


Contact
Group-M - GroupM@email.com
khoihunh2212@gmail.com
