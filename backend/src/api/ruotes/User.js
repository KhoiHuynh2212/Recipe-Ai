// User model
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  dietaryRestrictions: {
    type: [String],
    enum: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Keto', 'Paleo', 'Low-Carb'],
    default: []
  },
  allergens: {
    type: [String],
    default: []
  },
  preferences: {
    type: [String],
    default: []
  },
  savedRecipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe'
    }
  ],
  userIngredients: [
    {
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: String,
        required: false
      },
      expirationDate: {
        type: Date,
        required: false
      },
      category: {
        type: String,
        required: false
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  nutritionGoals: {
    goal: {
      type: String,
      enum: ['lose', 'maintain', 'gain'],
      default: 'maintain'
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'veryActive'],
      default: 'moderate'
    },
    dailyCalories: {
      type: Number,
      required: false
    },
    macros: {
      protein: {
        type: Number,
        required: false
      },
      carbs: {
        type: Number,
        required: false
      },
      fat: {
        type: Number,
        required: false
      }
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);