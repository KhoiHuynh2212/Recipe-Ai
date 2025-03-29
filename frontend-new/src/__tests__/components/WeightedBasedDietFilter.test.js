import React from 'react';
import { render, screen } from '@testing-library/react';
import WeightBasedDietFilter from '../../components/ChatUI/WeightBasedDietFilter';

describe('WeightBasedDietFilter', () => {
  test('renders component without crashing', () => {
    render(<WeightBasedDietFilter />);
    expect(screen.getByText(/personalized nutrition recommendations/i)).toBeInTheDocument();
  });

  test('shows "Get Personalized Recommendations" button', () => {
    render(<WeightBasedDietFilter />);
    expect(screen.getByRole('button', { name: /get personalized recommendations/i })).toBeInTheDocument();
  });

  test('initially hides the calculator form', () => {
    render(<WeightBasedDietFilter />);
    // The form should be hidden initially
    expect(screen.queryByText(/calculate nutrition plan/i)).not.toBeInTheDocument();
  });
});