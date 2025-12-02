import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User as UserIcon, MoreVertical } from 'lucide-react';
import { ChatMessage, User } from '../types';
import { chatWithAI } from '../services/geminiService';

interface TeamChatProps {
  currentUser: User;
}

const TeamChat: React.FC<TeamChatProps> = ({ currentUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', senderId: 'ai', text: 'Hello! I am NexusAI. How can I help with your project today?', timestamp: new Date(), isAi: true },
    { id: '2', senderId: 'u2', text: 'Has anyone checked the latest build?', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMsg]);
    const userText = inputText;
    setInputText('');

    // Check if message is for AI
    if (userText.toLowerCase().includes('@ai') || userText.toLowerCase().includes('nexus')) {
        setIsTyping(true);
        try {
            const aiResponse = await chatWithAI(userText);
            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                senderId: 'ai',
                text: aiResponse,
                timestamp: new Date(),
                isAi: true
            };
            setMessages(prev => [...prev, aiMsg]);
        } finally {
            setIsTyping(false);
        }
    } else {
        // Simulate random team response
        if (Math.random() > 0.7) {
            setTimeout(() => {
                 const replyMsg: ChatMessage = {
                    id: (Date.now() + 2).toString(),
                    senderId: 'u2',
                    text: "I'll take a look at that shortly.",
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, replyMsg]);
            }, 3000);
        }
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white dark:bg-dark-lighter rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Team Chat & AI
        </h3>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30 dark:bg-dark/20">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          const isAi = msg.isAi;
          
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              {!isMe && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 shadow-sm ${isAi ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200'}`}>
                  {isAi ? <Bot className="w-5 h-5" /> : <UserIcon className="w-5 h-5 text-gray-600" />}
                </div>
              )}
              <div 
                className={`
                  max-w-[75%] p-3 rounded-2xl text-sm shadow-sm
                  ${isMe 
                    ? 'bg-primary text-white rounded-br-none' 
                    : isAi 
                      ? 'bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-900/30 text-gray-800 dark:text-gray-200 rounded-bl-none'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                  }
                `}
              >
                {isAi && <span className="block text-[10px] font-bold text-indigo-500 mb-1">NexusAI</span>}
                {msg.text}
                <span className={`block text-[10px] mt-1 opacity-70 ${isMe ? 'text-indigo-100' : 'text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        {isTyping && (
             <div className="flex justify-start">
                 <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                     <Bot className="w-5 h-5 text-indigo-600" />
                 </div>
                 <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                 </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white dark:bg-dark-lighter border-t border-gray-100 dark:border-gray-700 flex gap-2">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message or @NexusAI..." 
          className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        <button 
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary/20"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default TeamChat;