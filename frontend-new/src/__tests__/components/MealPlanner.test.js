import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MealPlanner from '../../components/MealPlanner/MealPlanner';

// Mock any contexts or dependencies if needed
// For example, if your component uses a context:
// jest.mock('../../contexts/SomeContext', () => ({
//   useSomeContext: () => ({ someValue: 'mocked value' })
// }));

describe('MealPlanner Component', () => {
  // Basic render test
  test('renders without crashing', () => {
    render(<MealPlanner />);
    
    // Check if the component header is visible
    expect(screen.getByText('Weekly Meal Planner')).toBeInTheDocument();
  });

  // Test lifestyle selection
  test('allows user to select a lifestyle option', () => {
    render(<MealPlanner />);
    
    // Find and click on a lifestyle option
    const collegeOption = screen.getByText('College Student');
    fireEvent.click(collegeOption);
    
    // Should move to the next step (dietary restrictions)
    expect(screen.getByText('Any dietary restrictions?')).toBeInTheDocument();
  });

  // Part 2: Test for onGoBack callback
  test('calls onGoBack when close button is clicked', () => {
    // Create a mock function
    const mockGoBack = jest.fn();
    
    // Render with the mock function
    render(<MealPlanner onGoBack={mockGoBack} />);
    
    // Find and click the close button
    const closeButton = screen.getByRole('button', { name: /×/i });
    fireEvent.click(closeButton);
    
    // Check if the mock function was called
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  // You can add more tests here as needed
  
});