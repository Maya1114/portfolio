import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AnimatedBackground from "./components/AnimatedBackground";
import ScrollIndicator from "./components/ScrollIndicator";
import Hero from "./components/Hero";
import About from "./components/About";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import FinanceTracker from "./components/FinanceTracker/FinanceTracker";
import { Projects } from "./components/projects";
import { Project } from "../types/project";
import "../styles/globals.css"; // Ensure global styles are imported
import aiModImage from "./images/aiMod.jpg";
import chatbot from "./images/chatbot.webp";
import budget from "./images/budget.jpg";
import anon from "./images/anon.jpeg";

// Sample data with the new publish workflow -> replace with real projects
const sampleProjects: Project[] = [
  {
    id: "1",
    title: "React Portfolio Website",
    description: "Building a responsive portfolio with React and Tailwind CSS",
    status: "in-progress",
    progress: 75,
    startDate: "2024-01-15",
    deadline: "2024-02-15",
    category: "Frontend",
    dailyGoal: "2 hours coding",
  },
  {
    id: "3",
    title: "Expense Tracker App",
    description: "Full-stack expense tracking application with authentication",
    status: "planning",
    progress: 10,
    startDate: "2024-01-20",
    deadline: "2024-03-01",
    category: "Full-stack",
  },
  {
    id: "4",
    title: "Task Management Dashboard",
    description: "A productivity app for managing personal and team tasks",
    status: "completed",
    progress: 100,
    startDate: "2023-11-01",
    category: "Full-stack",
    // This one is completed but not yet published
    isPublished: false,
  },
  // {
  //   id: "5",
  //   title: "E-Commerce Platform",
  //   description: "Complete e-commerce solution with payment integration",
  //   status: "completed",
  //   progress: 100,
  //   startDate: "2023-09-01",
  //   category: "Full-stack",
  //   // This one is published
  //   isPublished: true,
  //   githubUrl: "https://github.com/username/ecommerce-platform",
  //   demoUrl: "https://my-ecommerce-demo.vercel.app",
  //   showcaseDescription:
  //     "A comprehensive e-commerce platform built with React, Node.js, and Stripe payments. Features include user authentication, product management, shopping cart, and secure checkout.",
  //   showcaseFeatures: [
  //     "User Authentication & Authorization",
  //     "Product Catalog with Search & Filters",
  //     "Shopping Cart & Wishlist",
  //     "Stripe Payment Integration",
  //     "Order Management System",
  //     "Admin Dashboard",
  //   ],
  //   showcaseImage:
  //     "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80",
  // },
  // {
  //   id: "6",
  //   title: "Algorithm Visualizer",
  //   description: "Interactive visualizations for sorting and graph algorithms",
  //   status: "completed",
  //   progress: 100,
  //   startDate: "2023-10-01",
  //   category: "Frontend",
  //   // This one is published
  //   isPublished: true,
  //   githubUrl: "https://github.com/username/algorithm-visualizer",
  //   demoUrl: "https://algorithm-visualizer-demo.netlify.app",
  //   showcaseDescription:
  //     "An interactive web application that visualizes various sorting and pathfinding algorithms. Built with React and Canvas API for smooth animations.",
  //   showcaseFeatures: [
  //     "Sorting Algorithm Visualization",
  //     "Pathfinding Algorithm Demos",
  //     "Adjustable Speed Controls",
  //     "Step-by-step Breakdown",
  //     "Multiple Array Sizes",
  //     "Educational Tooltips",
  //   ],
  //   showcaseImage:
  //     "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=800&q=80",
  // },
  {
    title: "AI Moderation Assistant",
    id: "6",
    description: "AI-driven moderation chatbot for real-time content analysis",
    status: "completed",
    progress: 100,
    startDate: "2025-06-01",
    category: "Full-stack / AI",
    isPublished: true,
    githubUrl: "https://github.com/yourusername/llm-moderation-assistant",
    demoUrl: "https://llm-moderation-demo.vercel.app",
    showcaseDescription:
      "Developed a moderation assistant using LangChain and OpenAI API, with Node.js/Python backend for real-time chat analysis and context-aware suggestions for moderators.",
    showcaseFeatures: [
      "Real-time message analysis",
      "AI-driven content flagging",
      "LangChain & OpenAI API integration",
      "Node.js/Python backend",
      "Context-aware moderation suggestions",
    ],
    showcaseImage: aiModImage,
  },
  {
    title: "Dental Office Assistant Chatbot",
    id: "7",
    description: "CLI-based AI assistant for dental office operations",
    status: "completed",
    progress: 100,
    startDate: "2025-02-01",
    category: "AI / Backend",
    isPublished: true,
    githubUrl: "https://github.com/Maya1114/dental-chatbot",
    demoUrl: "",
    showcaseDescription:
      "Built a Python-based conversational AI assistant deployed via CLI, leveraging Azure Functions and Cosmos DB. Automated appointment scheduling, insurance queries, and patient FAQs.",
    showcaseFeatures: [
      "CLI interface for easy deployment",
      "Azure Functions & Cosmos DB backend",
      "Automated scheduling and FAQs",
      "Python backend logic",
      "Improved patient engagement and operational efficiency",
    ],
    showcaseImage: chatbot,
  },
  {
    title: "Personal Finance Tracker",
    id: "8",
    description:
      "Serverless web app for automated expense tracking and budgeting",
    status: "completed",
    progress: 100,
    startDate: "2024-09-01",
    category: "Full-stack / Cloud",
    isPublished: true,
    githubUrl: "https://github.com/yourusername/aws-finance-tracker",
    demoUrl: "https://finance-tracker-demo.vercel.app",
    showcaseDescription:
      "Designed a serverless personal finance tracker with React frontend and AWS backend using Textract, SageMaker, Lambda, API Gateway, and MySQL RDS. Features automated receipt parsing, expense categorization, and secure budgeting analytics.",
    showcaseFeatures: [
      "AWS serverless architecture",
      "OCR receipt parsing with Textract",
      "Expense categorization with SageMaker",
      "React frontend with dynamic dashboards",
      "Secure MySQL RDS backend",
    ],
    showcaseImage: budget,
  },
  {
    title: "Facial Anonymization Tool",
    id: "9",
    description:
      "Privacy-preserving pipeline for facial images using hybrid GAN+blur",
    status: "completed",
    progress: 100,
    startDate: "2023-09-01",
    category: "AI / ML",
    isPublished: true,
    githubUrl: "https://github.com/Maya1114/Facial-Anonymization-Analysis",
    demoUrl: "",
    showcaseDescription:
      "Benchmarked 1M+ facial images using DeepFace on privacy-realted metrics and analyzed a hybrid GAN+blur anonymization pipeline to balance privacy preservation with downstream model performance.",
    showcaseFeatures: [
      "DeepFace open-source integration",
      "Hybrid GAN and blur anonymization",
      "Benchmarked 1M+ images",
      "PSNR, SSIM, and re-ID metrics",
      "Privacy-preserving computer vision pipeline",
    ],
    showcaseImage: anon,
  },
];

function App() {
  return (
    <Router>
      <div className="App">
        <AnimatedBackground />
        <ScrollIndicator />
        <main className="main-content">
          <Routes>
            <Route path="/finance" element={<FinanceTracker />} />
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <About />
                  {/* <Portfolio /> */}
                  <div className="max-w-7xl mx-auto w-full px-8 py-16">
                    <Projects
                      projects={sampleProjects}
                      onEditProject={(project) =>
                        console.log("Edit project:", project)
                      }
                      onUnpublishProject={(project) =>
                        console.log("Unpublish project:", project)
                      }
                    />
                  </div>
                  {/* <iframe
                    src="http://localhost:3000/widget/developer?showHeader=false"
                    width="70%"
                    height="200"
                    className="mx-auto my-8 block shadow-lg rounded-lg overflow-hidden"
                    style={{
                      borderRadius: "8px",
                      border: "1px solid transparent",
                    }}
                  ></iframe> */}

                  <Contact />
                </>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
