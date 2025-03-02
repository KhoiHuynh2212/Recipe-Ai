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
            Powered by AI - All recipes are generated with artificial intelligence
          </p>
        </div>
        
        <div className="footer-links">
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
          <a href="#" className="footer-link">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;