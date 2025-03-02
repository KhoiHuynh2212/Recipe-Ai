import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import ChatUI from './components/ChatUI/ChatUI';
import Footer from './components/Footer/Footer';
import { ChatProvider } from './contexts/ChatContext';

function App() {
  return (
    <div className="app">
      <ChatProvider>
        <Header />
        <main className="main-content">
          <ChatUI />
        </main>
        <Footer />
      </ChatProvider>
    </div>
  );
}

export default App;