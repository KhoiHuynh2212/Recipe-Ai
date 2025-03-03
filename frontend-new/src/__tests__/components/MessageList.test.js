import React from 'react';
import { render, screen } from '@testing-library/react';
import MessageList from '../../components/ChatUI/MessageList';

// Mock the MessageItem component
jest.mock('../../components/ChatUI/MessageItem', () => {
  return function MockMessageItem({ message }) {
    return <div data-testid={`message-${message.id}`}>{message.content}</div>;
  };
});

describe('MessageList component', () => {
  // Mock data
  const messages = [
    { id: 1, content: 'Hello', sender: 'user' },
    { id: 2, content: 'Hi there!', sender: 'bot' }
  ];

  test('renders messages correctly', () => {
    render(<MessageList messages={messages} isTyping={false} />);
    
    // Check if messages are rendered
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });

  test('shows typing indicator when isTyping is true', () => {
    render(<MessageList messages={messages} isTyping={true} />);
    
    // Use getByClassName instead of getByClass
    const typingIndicator = screen.getByTestId('typing-indicator');
    expect(typingIndicator).toBeInTheDocument();
  });

  // Since we mocked scrollIntoView, we can test that it's called
  test('scrolls to bottom when messages change', () => {
    render(<MessageList messages={messages} isTyping={false} />);
    
    // Verify that scrollIntoView was called
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });
});