import React, { useEffect, useState } from 'react';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    closeMenu();
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#header" className="nav-logo" onClick={() => scrollToSection('header')}>
          <span className="logo-text">MP</span>
          <span className="logo-dot"></span>
        </a>
        
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="#header" className="nav-link" onClick={() => scrollToSection('header')}>Home</a></li>
          <li><a href="#about" className="nav-link" onClick={() => scrollToSection('about')}>About</a></li>
          <li><a href="#portfolio" className="nav-link" onClick={() => scrollToSection('portfolio')}>Portfolio</a></li>
          <li><a href="#contact" className="nav-link" onClick={() => scrollToSection('contact')}>Contact</a></li>
        </ul>
        
        <div className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 