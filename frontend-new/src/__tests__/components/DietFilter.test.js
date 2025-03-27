import React from 'react';
import { render, screen } from '@testing-library/react';
import DietFilter from '../../components/ChatUI/DietFilter';

test('renders meal type component without crashing', () => {
    render(<DietFilter />);
    expect(screen.getByLabelText(/choose diet preference/i)).toBeInTheDocument();
});
