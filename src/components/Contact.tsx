import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Contact: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <motion.div 
          className="section-header"
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">Let's Connect</h2>
          <p className="section-subtitle">Ready to collaborate on your next project?</p>
        </motion.div>
        
        <motion.div 
          className="contact-content"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div className="contact-info" variants={itemVariants}>
            <div className="contact-card">
              <div className="contact-header">
                <i className="fas fa-envelope"></i>
                <h3>Get In Touch</h3>
              </div>
              <div className="contact-details">
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>maya.pandya1114@gmail.com</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>815-505-0222</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Northwestern University</span>
                </div>
              </div>
              <div className="social-links">
                <motion.a 
                  href="https://www.linkedin.com/in/maya-pandya" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fab fa-linkedin-in"></i>
                </motion.a>
                <motion.a 
                  href="https://github.com/Maya1114" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fab fa-github"></i>
                </motion.a>
              </div>
            </div>
          </motion.div>
          
          <motion.div className="contact-form" variants={itemVariants}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <motion.button 
                type="submit" 
                className="btn btn-primary"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Send Message</span>
                <i className="fas fa-paper-plane"></i>
              </motion.button>
            </form>
            {isSubmitted && (
              <motion.div 
                className="success-message"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                Message sent successfully!
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact; 