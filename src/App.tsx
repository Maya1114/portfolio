import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AnimatedBackground from './components/AnimatedBackground';
import ScrollIndicator from './components/ScrollIndicator';
import Hero from './components/Hero';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import FinanceTracker from './components/FinanceTracker/FinanceTracker';

function App() {
  return (
    <Router>
      <div className="App">
        <AnimatedBackground />
        <ScrollIndicator />
        <main className="main-content">
          <Routes>
            <Route path="/finance" element={<FinanceTracker />} />
            <Route path="/" element={
              <>
                <Hero />
                <About />
                <Portfolio />
                <Contact />
              </>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
