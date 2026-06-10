import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import './AIChatbot.css';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi! I'm Hassaan's AI Assistant. Ask me anything about his technical stack, RAG/AI pipeline experience, or project availability!"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef(null);

  const suggestions = [
    { label: 'Core Tech Stack', query: 'What is your core tech stack?' },
    { label: 'RAG & AI Projects', query: 'Tell me about your RAG & AI pipeline experience.' },
    { label: 'Consulting Availability', query: 'Are you available for contract/consulting roles?' },
    { label: 'Contact Details', query: 'How can I get in touch with you?' }
  ];

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    if (!textToSend) setInputValue('');

    // Trigger typing simulation
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botResponse = generateResponse(text);
      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    }, 800);
  };

  const generateResponse = (query) => {
    const cleanQuery = query.toLowerCase();

    if (cleanQuery.includes('stack') || cleanQuery.includes('tech') || cleanQuery.includes('language') || cleanQuery.includes('skill')) {
      return "Hassaan's core stack covers Python (Django, FastAPI), Scala for big data engineering, AWS services (EMR, Glue, S3), vector databases (pgvector, ChromaDB), and frontend layouts using React.js. He has over 10 years of expertise working in agile engineering setups.";
    }
    
    if (cleanQuery.includes('rag') || cleanQuery.includes('llm') || cleanQuery.includes('vector') || cleanQuery.includes('ai') || cleanQuery.includes('langchain') || cleanQuery.includes('agent')) {
      return "Hassaan designs advanced Retrieval-Augmented Generation (RAG) architectures: configuring semantic text chunking, embedding generation, hybrid vector search (dense + sparse), and metadata filtering. He orchestrates LLMs using LangChain and LangGraph for autonomous agentic workflows and deploys them securely via FastAPI and Docker.";
    }

    if (cleanQuery.includes('availability') || cleanQuery.includes('contract') || cleanQuery.includes('consult') || cleanQuery.includes('hire') || cleanQuery.includes('freelance') || cleanQuery.includes('job')) {
      return "Yes! Hassaan is currently open to new contract, consulting, and freelance opportunities. You can scroll to his 'Get in Touch' section to copy his phone number/email, or reach out directly at hassaan26@gmail.com.";
    }

    if (cleanQuery.includes('contact') || cleanQuery.includes('email') || cleanQuery.includes('phone') || cleanQuery.includes('linkedin') || cleanQuery.includes('github') || cleanQuery.includes('git')) {
      return "You can get in touch with Hassaan via email at hassaan26@gmail.com, call him at +92 3454124598, connect on LinkedIn (linkedin.com/in/hassaan-riaz-093a6651), or follow his work on GitHub (github.com/Hassaan26). Quick-action links are available in the contact section!";
    }

    if (cleanQuery.includes('hello') || cleanQuery.includes('hi ') || cleanQuery.includes('hey') || cleanQuery.startsWith('hi')) {
      return "Hello! Let me know if you want to know about Hassaan's core tech stack, his big data pipelines, AI/RAG works, or how to contact him.";
    }

    return "I'm Hassaan's virtual copilot! I can tell you about his 10+ years of software experience, backend APIs, data pipelines, and AI engineering. Try selecting one of the suggested prompts or ask me about his tech stack!";
  };

  return (
    <div className="chatbot-container">
      {/* Floating Toggle Button */}
      <button 
        className="chatbot-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Chatbot"
      >
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
        {!isOpen && <div className="chatbot-pulse"></div>}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-status-dot"></div>
              <h4>Hassaan's AI Copilot</h4>
            </div>
            <button 
              className="chat-close-btn" 
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="chat-history">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`}>
                <div className="message-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-message bot">
                <div className="message-bubble" style={{ padding: '8px 12px' }}>
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="chat-suggestions">
            <div className="chat-suggestions-title">Ask about:</div>
            <div className="suggestions-list">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  className="suggestion-btn"
                  onClick={() => handleSend(suggestion.query)}
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input Bar */}
          <form 
            className="chat-input-bar"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              className="chat-input"
              placeholder="Ask a question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="chat-send-btn" aria-label="Send Message">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
