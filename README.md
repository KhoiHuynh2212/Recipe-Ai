# AI Recipe Cooking App 🍳🤖

Welcome to the **AI Recipe Cooking App**! This app uses artificial intelligence to generate personalized recipes based on user inputs, such as dietary preferences, available ingredients, and cooking time. Whether you're a beginner or a seasoned chef, this app will help you create delicious meals at home.

---

## Table of Contents
1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Installation](#installation)
4. [Usage](#usage)
5. [API Documentation](#api-documentation)
6. [Development Workflow](#development-workflow)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Contributing](#contributing)
10. [License](#license)
11. [Contact](#contact)

---

## Features ✨
- **Personalized Recipe Recommendations**: Get recipes tailored to your dietary preferences (e.g., vegan, gluten-free) and available ingredients.
- **Ingredient Parsing**: Input the ingredients you have at home, and the app will suggest recipes you can make.
- **User Profiles**: Save your preferences, cooking history, and favorite recipes.
- **Step-by-Step Instructions**: Easy-to-follow cooking instructions for every recipe.
- **AI-Powered Suggestions**: Discover new recipes based on your cooking habits and preferences.
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices.

---

## Technologies Used 💻
### Frontend
- **React.js**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Axios**: For making HTTP requests to the backend.

### Backend
- **Node.js**: A JavaScript runtime for building the server.
- **Express.js**: A web framework for Node.js.
- **MongoDB**: A NoSQL database for storing user profiles and recipes.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB.

### AI/ML
- **Python**: For building the AI/ML models.
- **TensorFlow**: An open-source machine learning framework.
- **Natural Language Processing (NLP)**: For parsing user inputs and understanding ingredients.

### Version Control & Collaboration
- **Git**: For version control.
- **GitHub**: For hosting the repository and collaboration.

### Deployment
- **Docker**: For containerizing the application.
- **AWS (Amazon Web Services)**: For cloud hosting (or your preferred cloud provider).

---

## Installation 🛠️

- **Prerequisites**
	Before installing this project, ensure you have the following installed on your system:
	 - ** Python 3.8+ (Download Python3 https://www.python.org/downloads/) **
	 - **pip (Python package manager) (comes with Python)**
	 - ** PyTorch (Deep Learning Framework) (Download Pytorch https://pytorch.org/) **
	 - ** Virtual Environment (optional but recommended) **


- **Install Step**
	**1. Clone the Repository**
		git clone https://github.com/Group-M/AiRecipe-project.git
  		cd AiReciepe-project
  	**2. Create and Activate a Virtual Environment**
		# Create virtual environment
			python3 -m venv venv

		# Activate it (MacOS/Linux)
		source venv/bin/activate

		# Activate it (Windows)
		venv\Scripts\activate

	**3. Install Dependencies**
		pip install --upgrade pip
		pip install -r requirements.txt

	**4. Install PyTorch**
	Download Pytorch https://pytorch.org/
	pip install torch torchvision torchaudio


	**5. Verify Installation**
	python -c "import torch; print(torch.__version__)"

	If PyTorch is installed correctly, it should print the installed version number.


### Usage 🍽️
- **Create a User Profile**: Sign up and input your dietary preferences and restrictions.

- **Input Ingredients** : Enter the ingredients you have at home.

- **Get Recipes** : The app will generate personalized recipes based on your inputs.

- **Cook and Enjoy** : Follow the step-by-step instructions to prepare your meal.

### Configuration
- **Environment Variables**: Create a .env file in the root of both the frontend and backend directories. This file contains sensitive information like API keys, database credentials, and other configurations that should not be hard-coded.

- **Backend Configuration(.env file)** : The backend requires a few environment variables to connect to the database and other services.

- **Frontend Configuration (.env file)** : For the frontend, you'll configure the backend API URL and any third-party services.

- **Cook and Enjoy** : Follow the step-by-step instructions to prepare your meal.

###Contributing Guidelines 
We welcome contributions to the AI Recipe Cooking App! Here’s how to contribute:

- **Fork the repository and clone it to your local machine.**
- **Create a new branch for your feature or fix.**
- **Commit your changes with a descriptive message.**
- **Push your changes to your fork.**
- **Create a Pull Request to merge into the main branch.**
- **Code review: We’ll review and provide feedback. Update as needed.**

## Lisense
This project is licensed under the OU COMPUTER SCIENCE License.

You are free to use, modify, and distribute the code, with the following conditions:

- ** Include the original copyright notice and license in all copies or substantial portions of the software.** 
- ** The software is provided "as is" without warranty of any kind.** 


###Contact
Group-M - GroupM@email.com


