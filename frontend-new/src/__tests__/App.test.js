import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the MessageList component to avoid scrollIntoView error
jest.mock('../components/ChatUI/MessageList', () => {
  return function MockMessageList() {
    return <div data-testid="message-list">Message list mock</div>;
  };
});

test('renders the app component', () => {
  render(<App />);
  
  // Check for the presence of the mock component
  const messageListElement = screen.getByTestId('message-list');
  expect(messageListElement).toBeInTheDocument();
  
  // Or check for another unique element that should always be present
  const appElement = document.querySelector('.app');
  expect(appElement).toBeInTheDocument();
});