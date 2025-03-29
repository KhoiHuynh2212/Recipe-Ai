
import React from 'react';
import { render, screen } from '@testing-library/react';
import IngredientManagement from '../../components/ChatUI/IngredientManagement';

describe('IngredientManagement', () => {
  test('renders component without crashing', () => {
    render(<IngredientManagement onSendMessage={() => {}} />);
    expect(screen.getByText(/my pantry/i)).toBeInTheDocument();
  });

  test('shows toggle button', () => {
    render(<IngredientManagement onSendMessage={() => {}} />);
    expect(screen.getByText(/show pantry/i)).toBeInTheDocument();
  });
});