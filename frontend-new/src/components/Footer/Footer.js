import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} AI Recipe Chef
          </p>
          <p className="footer-disclaimer">
            Powered by AI - All recipes are generated with artificial intelligence - Enjoy your meal!
          </p>
        </div>
        
        <div className="footer-links">
          <a href="/privacy" className="footer-link">Privacy Policy</a>
          <a href="/terms" className="footer-link">Terms of Service</a>
          <a href="/contact" className="footer-link">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;