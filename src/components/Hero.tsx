import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section id="header" className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <motion.div 
              className="hero-badge"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <i className="fas fa-code"></i>
              <span>Software Engineer</span>
            </motion.div>
            
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Hi, I'm <span className="highlight">Maya</span> Pandya
            </motion.h1>
            
            <motion.p 
              className="hero-description"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Crafting intelligent solutions at the intersection of machine learning and software engineering. 
              Graduate with expertise in ML, cloud architecture, and innovative problem-solving.
            </motion.p>
            
            <motion.div 
              className="hero-actions"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.button 
                className="btn btn-primary"
                onClick={() => scrollToSection('portfolio')}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>View My Work</span>
                <i className="fas fa-arrow-right"></i>
              </motion.button>
              <motion.button 
                className="btn btn-secondary"
                onClick={() => scrollToSection('contact')}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get In Touch</span>
                <i className="fas fa-envelope"></i>
              </motion.button>
            </motion.div>
          </div>
          
          <div className="hero-visual">
            <motion.div 
              className="hero-image"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <img src={process.env.PUBLIC_URL + "/images/user.jpg"} alt="Maya Pandya" />
              <div className="image-overlay"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 