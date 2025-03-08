#!/bin/bash
# Test environment setup script for AI Recipe Chef

echo "===== TESTING ENVIRONMENT SETUP ====="
echo "Running test environment setup for AI Recipe Chef..."

# Define colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓ $2${NC}"
  else
    echo -e "${RED}✗ $2${NC}"
    echo "Error code: $1"
  fi
}

# Step 1: Check Node.js and npm versions
echo -e "\n${YELLOW}Step 1: Checking Node.js and npm versions${NC}"
node -v
npm -v
print_status $? "Node.js and npm check"

# Step 2: Install dependencies if needed
echo -e "\n${YELLOW}Step 2: Checking dependencies${NC}"
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
  echo "Installing dependencies..."
  npm ci
  print_status $? "Dependencies installation"
else
  echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# Step 3: Check setupTests.js file
echo -e "\n${YELLOW}Step 3: Checking setupTests.js file${NC}"
if [ -f "src/setupTests.js" ]; then
  echo -e "${GREEN}✓ setupTests.js exists${NC}"
else
  echo "Creating setupTests.js file..."
  echo "import '@testing-library/jest-dom';" > src/setupTests.js
  echo "" >> src/setupTests.js
  echo "// Mock scrollIntoView method which is not implemented in JSDOM" >> src/setupTests.js
  echo "Element.prototype.scrollIntoView = jest.fn();" >> src/setupTests.js
  print_status $? "setupTests.js creation"
fi

# Step 4: Run tests
echo -e "\n${YELLOW}Step 4: Running tests${NC}"
npm test
TEST_STATUS=$?
print_status $TEST_STATUS "Test execution"

# Step 5: Build the application in test mode
echo -e "\n${YELLOW}Step 5: Building application in test mode${NC}"
REACT_APP_ENVIRONMENT=test npm run build
BUILD_STATUS=$?
print_status $BUILD_STATUS "Application build"

# Summary
echo -e "\n${YELLOW}===== TEST ENVIRONMENT SUMMARY =====${NC}"
if [ $TEST_STATUS -eq 0 ] && [ $BUILD_STATUS -eq 0 ]; then
  echo -e "${GREEN}✓ Environment setup completed successfully!${NC}"
  echo -e "You can now push changes to your development branch to trigger CI/CD pipeline."
else
  echo -e "${RED}✗ Environment setup has issues that need to be fixed.${NC}"
  echo -e "Please resolve the errors above before pushing to the development branch."
  exit 1
fi