import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { chatWithAI } from '../services/api';
import PageTransition from '../components/PageTransition';
import { Send, Mic, MicOff, Compass, MessageSquare, Plus, PlusCircle, HelpCircle, ShieldAlert } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AIAssistantPage() {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    setMessages([
      { role: 'ai', text: t('welcomeMessage') }
    ]);
  }, [language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: messageText }]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatWithAI(messageText, language);
      setMessages(prev => [...prev, { role: 'ai', text: res.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: t('chatFallback') }]);
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
      setInput(transcript);
      handleSend(transcript);
    };
    recognition.start();
  };

  const sidebarTopics = [
    { label: t('topicFinalsLabel'), query: t('topicFinalsQuery') },
    { label: t('topicTransitLabel'), query: t('topicTransitQuery') },
    { label: t('topicEcoLabel'), query: t('topicEcoQuery') },
    { label: t('topicAccessLabel'), query: t('topicAccessQuery') },
    { label: t('topicReportLabel'), query: t('topicReportQuery') },
  ];

  const prompts = [
    t('promptGateC'),
    t('promptRestroom'),
    t('promptAccess'),
    t('promptTransit'),
  ];

  return (
    <PageTransition>
      <div style={{ display: 'flex', height: 'calc(100vh - 76px)', background: '#F7FAFC', overflow: 'hidden' }}>
        
        {/* Left ChatGPT-style Sidebar */}
        <div className="chat-sidebar" style={{
          width: 260, borderRight: '1px solid #E5E7EB', background: 'white',
          display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0
        }}>
          {/* New Chat Button */}
          <div style={{ padding: 16 }}>
            <button
              onClick={() => setMessages([{ role: 'ai', text: '⚽ Welcome to the **FIFA World Cup 2026 AI Assistant**!\n\nI can help you navigate MetLife Stadium, find facilities, understand parking/transportation, check security regulations, and more.\n\n*How can I help you today?*' }])}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', borderRadius: 12, border: '1px solid #E5E7EB',
                background: '#F9FAFB', color: '#1F2937', fontWeight: 600, fontSize: 13,
                cursor: 'pointer', transition: 'all 0.2s', outline: 'none'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#EAF4FF'}
              onMouseLeave={e => e.currentTarget.style.background = '#F9FAFB'}
            >
              <Plus size={16} color="#0057B8" />
              New Conversation
            </button>
          </div>

          {/* Topic list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', paddingLeft: 8, marginBottom: 4 }}>
              Suggested Topics
            </span>
            {sidebarTopics.map(topic => (
              <button
                key={topic.label}
                onClick={() => handleSend(topic.query)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '10px 12px', borderRadius: 10, border: 'none',
                  background: 'transparent', color: '#4B5563', cursor: 'pointer',
                  textAlign: 'left', fontSize: 13, fontWeight: 500, transition: 'all 0.15s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.color = '#1F2937'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4B5563'; }}
              >
                <MessageSquare size={14} color="#6B7280" />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {topic.label}
                </span>
              </button>
            ))}
          </div>

          {/* Footer info in sidebar */}
          <div style={{ padding: 16, borderTop: '1px solid #E5E7EB', background: '#F9FAFB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00A651' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#4B5563' }}>FIFA AI Companion v1.0</span>
            </div>
          </div>
        </div>

        {/* Center Main Chat Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
          
          {/* Top header strip */}
          <div style={{
            height: 60, borderBottom: '1px solid #E5E7EB', background: 'white',
            display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>🤖</span>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1F2937', margin: 0, fontFamily: 'Poppins' }}>
                  StadiumPulse Gemini Assistant
                </h2>
                <span style={{ fontSize: 11, color: '#00A651', fontWeight: 600 }}>Active Online</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>
                Response Lang: <strong>{t('realTime')}</strong>
              </span>
            </div>
          </div>

          {/* Messages display container */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 120px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ maxWidth: 800, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    width: '100%'
                  }}
                >
                  {msg.role === 'user' ? (
                    <div className="chat-bubble-user" style={{
                      background: 'linear-gradient(135deg, #0057B8 0%, #0070E0 100%)',
                      color: 'white', padding: '14px 20px', borderRadius: '20px 20px 4px 20px',
                      maxWidth: '75%', fontSize: 14, lineHeight: 1.6, boxShadow: '0 4px 12px rgba(0, 87, 184, 0.15)'
                    }}>
                      {msg.text}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 16, maxWidth: '85%' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', background: '#EAF4FF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0
                      }}>
                        ⚽
                      </div>
                      <div className="chat-bubble-ai" style={{
                        background: 'white', color: '#1F2937', padding: '18px 24px',
                        borderRadius: '4px 20px 20px 20px', fontSize: 14, lineHeight: 1.6,
                        border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                      }}>
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {loading && (
                <div style={{ display: 'flex', gap: 16, width: '100%' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', background: '#EAF4FF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                  }}>
                    ⚽
                  </div>
                  <div style={{ display: 'flex', gap: 6, padding: '12px 20px', background: 'white', borderRadius: 16, width: 80, border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        style={{ width: 8, height: 8, borderRadius: '50%', background: '#0057B8' }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Pinned Bottom input panel */}
          <div className="chat-input-container" style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(180deg, transparent 0%, rgba(247,250,252,0.9) 20%, #F7FAFC 100%)',
          }}>
            <div style={{ maxWidth: 800, width: '100%', margin: '0 auto' }}>
              {/* Prompt chips inside input focus zone */}
              {messages.length === 1 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, justifyContent: 'center' }}>
                  {prompts.map(p => (
                    <button
                      key={p}
                      onClick={() => handleSend(p)}
                      className="chip"
                      style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Input box */}
              <div style={{
                background: 'white', borderRadius: 28, border: '1px solid #D1D5DB',
                boxShadow: '0 10px 30px rgba(0, 87, 184, 0.05)', display: 'flex', alignItems: 'center',
                padding: '6px 8px 6px 18px', gap: 8
              }}>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about gates, food, rules, transport..."
                  style={{
                    flex: 1, border: 'none', outline: 'none', fontSize: 14,
                    fontFamily: 'Inter', color: '#1F2937'
                  }}
                />
                <button
                  onClick={handleVoice}
                  style={{
                    width: 40, height: 40, borderRadius: '50%', border: 'none',
                    background: listening ? '#EAF4FF' : 'transparent', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                  }}
                >
                  {listening ? <MicOff size={18} color="#0057B8" /> : <Mic size={18} color="#6B7280" />}
                </button>
                <button
                  onClick={() => handleSend()}
                  className="btn-primary"
                  style={{ height: 40, width: 40, padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  <Send size={16} color="white" />
                </button>
              </div>
              <div style={{ textAlign: 'center', fontSize: 11, color: '#9CA3AF', marginTop: 8 }}>
                Gemini 1.5 Flash may display inaccurate information. Verify match details.
              </div>
            </div>
          </div>

        </div>

      </div>
      <style>{`
        @media (max-width: 768px) {
          .chat-sidebar { display: none !important; }
        }
      `}</style>
    </PageTransition>
  );
}
