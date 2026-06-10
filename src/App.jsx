import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Articles from './components/Articles';
import Contact from './components/Contact';
import AIChatbot from './components/AIChatbot';

export default function App() {
  return (
    <div className="app-container">
      {/* Dynamic ambient backgrounds */}
      <div className="glow-bg">
        <div className="glow-orb-1"></div>
        <div className="glow-orb-2"></div>
      </div>

      {/* Navigation Header */}
      <Header />

      {/* Main Sections */}
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Articles />
        <Contact />
      </main>

      {/* Floating AI Chatbot Widget */}
      <AIChatbot />
    </div>
  );
}
