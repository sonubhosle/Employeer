import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User as UserIcon, MoreVertical, Shield, Users } from 'lucide-react';
import { ChatMessage, User, UserRole } from '../types';
import { chatWithAI } from '../services/geminiService';

interface TeamChatProps {
  currentUser: User;
}

const TeamChat: React.FC<TeamChatProps> = ({ currentUser }) => {
  const [activeChannel, setActiveChannel] = useState<'team' | 'admin'>('team');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', senderId: 'ai', text: 'Hello! I am NexusAI. How can I help with your project today?', timestamp: new Date(), isAi: true, channel: 'team' },
    { id: '2', senderId: 'u2', text: 'Has anyone checked the latest build?', timestamp: new Date(Date.now() - 1000 * 60 * 5), channel: 'team' },
    { id: '3', senderId: 'a1', text: 'Please send me the weekly report.', timestamp: new Date(Date.now() - 1000 * 60 * 60), channel: 'admin' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChannel]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: inputText,
      timestamp: new Date(),
      channel: activeChannel
    };

    setMessages(prev => [...prev, newMsg]);
    const userText = inputText;
    setInputText('');

    if (userText.toLowerCase().includes('@ai') || userText.toLowerCase().includes('nexus')) {
        setIsTyping(true);
        try {
            const aiResponse = await chatWithAI(userText);
            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                senderId: 'ai',
                text: aiResponse,
                timestamp: new Date(),
                isAi: true,
                channel: activeChannel
            };
            setMessages(prev => [...prev, aiMsg]);
        } finally {
            setIsTyping(false);
        }
    } else if (activeChannel === 'admin') {
         // Auto-reply simulation for Admin chat
         setTimeout(() => {
             const replyMsg: ChatMessage = {
                id: (Date.now() + 2).toString(),
                senderId: 'a1',
                text: "I've received your message. Will review shortly.",
                timestamp: new Date(),
                channel: 'admin'
            };
            setMessages(prev => [...prev, replyMsg]);
        }, 2000);
    }
  };

  const filteredMessages = messages.filter(m => (m.channel || 'team') === activeChannel);

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-dark-lighter rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-col gap-3">
        <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Communication Hub
            </h3>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <MoreVertical className="w-5 h-5" />
            </button>
        </div>
        
        {/* Channel Switcher */}
        <div className="flex bg-gray-200 dark:bg-gray-700/50 p-1 rounded-lg">
            <button 
                onClick={() => setActiveChannel('team')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-medium transition-all ${activeChannel === 'team' ? 'bg-white dark:bg-gray-800 text-primary shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
            >
                <Users className="w-3.5 h-3.5" /> Team
            </button>
            <button 
                onClick={() => setActiveChannel('admin')}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-medium transition-all ${activeChannel === 'admin' ? 'bg-white dark:bg-gray-800 text-secondary shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
            >
                <Shield className="w-3.5 h-3.5" /> Admin
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30 dark:bg-dark/20">
        {filteredMessages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          const isAi = msg.isAi;
          
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              {!isMe && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 shadow-sm ${isAi ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 overflow-hidden'}`}>
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
          placeholder={activeChannel === 'team' ? "Message team or @NexusAI..." : "Message admin..."}
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