import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Mic, MicOff } from 'lucide-react';
import { chatWithAI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import ReactMarkdown from 'react-markdown';

export default function FloatingAIButton() {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    setMessages([
      { role: 'ai', text: language === 'es' ? '⚽ ¡Hola! Soy StadiumPulse AI. ¡Pregúntame lo que quieras sobre tu experiencia!' : language === 'pt' ? '⚽ Olá! Eu sou o StadiumPulse AI. Pergunte-me qualquer coisa sobre sua experiência!' : '⚽ Hi! I\'m StadiumPulse AI. Ask me anything about your matchday experience!' }
    ]);
  }, [language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await chatWithAI(text, language);
      setMessages(prev => [...prev, { role: 'ai', text: res.data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: language === 'es' ? '⚽ ¡Pregúntame sobre accesos, transporte o servicios!' : language === 'pt' ? '⚽ Pergunte-me sobre portões, transporte ou instalações!' : '⚽ Ask me about gates, transport, or any stadium facility!' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      sendMessage(transcript);
    };
    recognition.start();
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed', bottom: 88, right: 24, zIndex: 90,
          width: 60, height: 60, borderRadius: '50%',
          background: 'linear-gradient(135deg, #0057B8, #0070E0)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
          boxShadow: '0 8px 32px rgba(0, 87, 184, 0.4), 0 0 0 8px rgba(0, 87, 184, 0.1)',
        }}
        aria-label="Open AI Chat"
      >
        {open ? <X size={24} color="white" /> : '⚽'}
      </motion.button>

      {/* Mini Chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            style={{
              position: 'fixed', bottom: 160, right: 24, zIndex: 89,
              width: 340, borderRadius: 20,
              background: 'white',
              boxShadow: '0 20px 60px rgba(0,87,184,0.2)',
              border: '1px solid #E5E7EB',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0057B8, #0070E0)',
              padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <div style={{ fontSize: 24 }}>⚽</div>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 15, fontFamily: 'Poppins' }}>
                  StadiumPulse AI
                </div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                  Always here to help
                </div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00A651', animation: 'pulse-ring 1.5s infinite' }} />
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>Live</span>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              height: 280, overflowY: 'auto', padding: '16px',
              display: 'flex', flexDirection: 'column', gap: 12
            }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                >
                  <div style={msg.role === 'user' ? {
                    background: 'linear-gradient(135deg, #0057B8, #0070E0)',
                    color: 'white', padding: '10px 14px',
                    borderRadius: '16px 16px 4px 16px',
                    maxWidth: '80%', fontSize: 13, lineHeight: 1.5
                  } : {
                    background: '#F7FAFC', color: '#1F2937',
                    padding: '10px 14px',
                    borderRadius: '16px 16px 16px 4px',
                    maxWidth: '85%', fontSize: 13, lineHeight: 1.5,
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}>
                    {msg.role === 'user' ? (
                      msg.text
                    ) : (
                      <div className="markdown-chat">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div style={{ display: 'flex', gap: 4, padding: '10px 14px' }}>
                  {[0,1,2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      style={{ width: 8, height: 8, borderRadius: '50%', background: '#0057B8' }}
                    />
                  ))}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: '12px 16px', borderTop: '1px solid #E5E7EB',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                placeholder="Ask anything..."
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: 50,
                  border: '1px solid #E5E7EB', fontSize: 13,
                  background: '#F7FAFC', outline: 'none',
                  fontFamily: 'Inter'
                }}
              />
              <button onClick={handleVoice} style={{
                width: 36, height: 36, borderRadius: '50%',
                border: '1px solid #E5E7EB', background: listening ? '#EAF4FF' : 'white',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {listening ? <MicOff size={15} color="#0057B8" /> : <Mic size={15} color="#6B7280" />}
              </button>
              <button onClick={() => sendMessage(input)} style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #0057B8, #0070E0)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Send size={15} color="white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .floating-ai { bottom: 80px !important; }
        }
        .markdown-chat p { margin: 0 0 8px; }
        .markdown-chat p:last-child { margin-bottom: 0; }
        .markdown-chat ul, .markdown-chat ol { margin: 4px 0; padding-left: 20px; }
      `}</style>
    </>
  );
}
