// Recipe model
const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  ingredients: [
    {
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: String,
        required: false
      },
      unit: {
        type: String,
        required: false
      }
    }
  ],
  instructions: {
    type: String,
    required: [true, 'Instructions are required']
  },
  time: {
    type: String,
    required: [true, 'Cooking time is required']
  },
  servings: {
    type: Number,
    required: [true, 'Number of servings is required'],
    min: [1, 'Servings must be at least 1']
  },
  image: {
    type: String,
    required: false,
    default: 'default-recipe.jpg'
  },
  dietaryRestrictions: {
    type: [String],
    enum: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Keto', 'Paleo', 'Low-Carb'],
    required: false
  },
  nutritionalInfo: {
    calories: {
      type: Number,
      required: false
    },
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
    },
    fiber: {
      type: Number,
      required: false
    }
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  tags: {
    type: [String],
    required: false
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  ratings: [
    {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
      },
      comment: {
        type: String,
        required: false
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  averageRating: {
    type: Number,
    default: 0
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Set the updatedAt field before saving
RecipeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate average rating
  if (this.ratings.length > 0) {
    const totalRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    this.averageRating = totalRating / this.ratings.length;
  }
  
  next();
});

module.exports = mongoose.model('Recipe', RecipeSchema);