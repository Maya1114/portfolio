import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const skillsAndServices = [
    {
      icon: 'fas fa-code',
      title: 'Programming & Development',
      description: 'Full-stack development with modern technologies and best practices.',
      skills: ['Python', 'C++', 'JavaScript', 'MATLAB'],
      features: ['Web Development', 'API Design', 'Database Design']
    },
    {
      icon: 'fas fa-brain',
      title: 'Machine Learning & AI',
      description: 'Designing and implementing intelligent solutions for complex problems.',
      skills: ['TensorFlow', 'PyTorch', 'Keras', 'Data Analysis'],
      features: ['Neural Networks', 'Computer Vision', 'NLP']
    },
    {
      icon: 'fas fa-cloud',
      title: 'Cloud & DevOps',
      description: 'Building scalable, reliable architectures using modern cloud technologies.',
      skills: ['AWS', 'Docker', 'Git', 'MySQL'],
      features: ['Microservices', 'Cloud Deployment', 'CI/CD']
    }
  ];

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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="about" className="about">
      <div className="container">
        <motion.div 
          className="section-header"
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">About Me & What I Do</h2>
          <p className="section-subtitle">Passionate about technology and innovation</p>
        </motion.div>
        
        <div className="about-content">
          <motion.div 
            className="about-text"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="about-intro">
              I'm a computer science graduate student with an undergraduate degree in biomedical engineering. 
              My work focuses on combining these fields to develop practical and impactful solutions that 
              bridge the gap between technology and real-world applications.
            </p>
            
            <motion.div 
              className="skills-showcase"
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              {skillsAndServices.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="skill-category"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <div className="skill-header">
                    <i className={item.icon}></i>
                    <h3>{item.title}</h3>
                  </div>
                  <p className="skill-description">{item.description}</p>
                  <div className="skill-tags">
                    {item.skills.map((skill) => (
                      <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                  <div className="service-features">
                    {item.features.map((feature) => (
                      <span key={feature} className="service-feature">{feature}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About; 