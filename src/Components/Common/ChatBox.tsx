import React, { useState, useEffect, useRef } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined, CloseOutlined, MessageOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: number;
  text: string;
  fromUser: boolean;
}

export const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen((prev) => !prev);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg: Message = {
      id: Date.now(),
      text: input.trim(),
      fromUser: true,
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        text: `You said: ${newMsg.text}`,
        fromUser: false,
      };
      setMessages(prev => [...prev, botMsg]);
    }, 500);
  };

  return (
    <>
      {/* ── Floating Toggle Button ── */}
      <motion.div className="floating-chat-btn-wrapper">
        <Button
          shape="circle"
          size="large"
          icon={<MessageOutlined style={{ fontSize: 20 }} />}
          onClick={toggleChat}
          className="floating-chat-btn"
        />
      </motion.div>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="floating-chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Header */}
            <div className="floating-chat-header">
              <span>Live Chat</span>
              <CloseOutlined onClick={toggleChat} className="floating-chat-close" />
            </div>

            {/* Messages Area */}
            <div className="floating-chat-body">
              {messages.length === 0 && (
                <div className="floating-chat-empty">How can we help you today?</div>
              )}
              
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  className={`floating-chat-bubble ${msg.fromUser ? 'user' : 'bot'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {msg.text}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="floating-chat-footer">
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={handleSend}
                size="small"
                className="floating-chat-input"
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                size="small"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChat;