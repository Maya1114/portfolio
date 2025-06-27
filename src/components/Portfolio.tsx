import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  link: string;
  isReactApp?: boolean;
  openInNewTab?: boolean;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Finance Tracker App',
    description: 'AWS-powered application using SageMaker and Textract for intelligent financial tracking and analysis.',
    image: process.env.PUBLIC_URL + '/images/finance.jpg',
    technologies: ['AWS', 'SageMaker', 'Textract'],
    link: '/react-portfolio/finance',
    isReactApp: true,
    openInNewTab: true
  },
  {
    id: 2,
    title: 'Photos App',
    description: 'Cloud-based photo storage system with MySQL database integration for seamless user experience.',
    image: process.env.PUBLIC_URL + '/images/photos.jpg',
    technologies: ['Cloud', 'MySQL', 'Web App'],
    link: process.env.PUBLIC_URL + '/photo-app.html'
  },
  {
    id: 3,
    title: 'OSM Navigation System',
    description: 'Campus navigation system using OpenStreetMap data for Northwestern University with real-time routing.',
    image: process.env.PUBLIC_URL + '/images/OSM.jpg',
    technologies: ['OpenStreetMap', 'Navigation', 'Routing'],
    link: process.env.PUBLIC_URL + '/osm.html'
  },
  {
    id: 4,
    title: 'FACE: Facial Anonymization Ethics',
    description: 'Computer vision project evaluating bias in face anonymization using ML classifiers and fairness audits.',
    image: process.env.PUBLIC_URL + '/images/face-project.jpg',
    technologies: ['Computer Vision', 'Ethics', 'ML'],
    link: process.env.PUBLIC_URL + '/FACE.html'
  }
];

const Portfolio: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="portfolio" className="portfolio">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="section-header"
        >
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">Showcasing my latest work and achievements</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="portfolio-grid"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="project-card"
            >
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className="project-overlay">
                  <div className="project-tech">
                    {project.technologies.map((tech, index) => (
                      <span key={index}>{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                {project.isReactApp ? (
                  <Link to={project.link} className="project-link" target="_blank" rel="noopener noreferrer">
                    <span>View Project</span>
                    <i className="fas fa-external-link-alt"></i>
                  </Link>
                ) : (
                  <a href={project.link} className="project-link" target="_blank" rel="noopener noreferrer">
                    <span>View Project</span>
                    <i className="fas fa-external-link-alt"></i>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio; 