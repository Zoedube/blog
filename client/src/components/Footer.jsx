import React from 'react';
import Logo from '../img/logo.png';

const Footer = () => {
  return (
    <footer>
      <div className="footer-logo">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="footer-links">
        <a href="/careers">Careers</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/contact">Contact Us</a>
      </div>
      <span>Designed by Zoe Dube</span>
    </footer>
  );
}

export default Footer;


