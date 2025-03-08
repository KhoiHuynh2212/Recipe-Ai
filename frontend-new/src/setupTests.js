import '@testing-library/jest-dom';

// Mock scrollIntoView method which is not implemented in JSDOM
Element.prototype.scrollIntoView = jest.fn();