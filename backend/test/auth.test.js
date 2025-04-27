// auth.test.js
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables for testing
dotenv.config({ path: '.env.test' });

// Import the auth middleware
const authMiddleware = require('./authMiddleware');

// Create a simple Express app for testing
const app = express();
app.use(express.json());

// Add a test protected route
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ 
    success: true, 
    message: 'Access granted', 
    user: req.user 
  });
});

// Add a test route for API key auth
app.get('/api-key-protected', authMiddleware, (req, res) => {
  res.json({ 
    success: true, 
    message: 'API key access granted', 
    isApiAuthenticated: req.isApiAuthenticated
  });
});

describe('Authentication Middleware Tests', () => {
  // JWT Secret for testing
  const JWT_SECRET = 'test-secret';
  process.env.JWT_SECRET = JWT_SECRET;
  
  // API Key for testing
  const API_KEY = 'test-api-key';
  process.env.API_KEY = API_KEY;

  // Test valid JWT token
  test('Should allow access with valid JWT token', async () => {
    // Create a test token
    const token = jwt.sign({ userId: 'test-user', username: 'tester' }, JWT_SECRET);
    
    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user.userId).toBe('test-user');
  });

  // Test invalid JWT token
  test('Should deny access with invalid JWT token', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalid-token');
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  // Test valid API key
  test('Should allow access with valid API key', async () => {
    const response = await request(app)
      .get('/api-key-protected')
      .set('Authorization', `ApiKey ${API_KEY}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.isApiAuthenticated).toBe(true);
  });

  // Test invalid API key
  test('Should deny access with invalid API key', async () => {
    const response = await request(app)
      .get('/api-key-protected')
      .set('Authorization', 'ApiKey invalid-key');
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  // Test missing Authorization header
  test('Should deny access when Authorization header is missing', async () => {
    const response = await request(app)
      .get('/protected');
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  // Test incorrect Authorization format
  test('Should deny access when Authorization header has incorrect format', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'InvalidFormat token123');
    
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});

// This code can be run with Jest or another test runner
// To run with Jest, install it with: npm install --save-dev jest supertest
// Then run: npx jest auth.test.js