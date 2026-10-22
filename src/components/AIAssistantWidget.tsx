/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  Truck,
  RotateCcw,
  CreditCard,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatTaka } from '../utils/pricing';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  options?: string[];
}

export const AIAssistantWidget: React.FC = () => {
  const { currentView, products, setSelectedProductId } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Salam! I am your SaiMx Smart Assistant. How can I assist you with your shopping or delivery today?',
      options: [
        'How does the 150 TK delivery payment work?',
        'What are delivery times for Dhaka vs outside?',
        'What is your return & refund policy?',
        'Do you have authentic Sundarban honey?',
      ],
    },
  ]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: Message = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    // Instant intelligent rule-based / FAQ matcher
    setTimeout(() => {
      let reply = '';
      let replyOptions: string[] | undefined;

      const q = query.toLowerCase();

      if (q.includes('150') || q.includes('payment') || q.includes('bkash') || q.includes('nagad') || q.includes('upfront')) {
        reply =
          'At SaiMx, you pay only the 150 TK delivery fee upfront via bKash or Nagad (to Merchant: 01735126250) to confirm your booking. The entire remaining product price is paid safely as Cash on Delivery (COD) once you inspect your parcel!';
        replyOptions = ['How do I track my order?', 'Browse products'];
      } else if (q.includes('time') || q.includes('delivery') || q.includes('dhaka') || q.includes('shipping')) {
        reply =
          '🚀 Dhaka City Delivery: 24 to 48 Hours.\n📦 Outside Dhaka (all 64 districts): 2 to 4 Days via Pathao or Steadfast courier.\n⚡ Free delivery applies on orders 5,000 TK and above!';
        replyOptions = ['Is cash on delivery available?', 'How to place order?'];
      } else if (q.includes('return') || q.includes('refund') || q.includes('policy') || q.includes('damage')) {
        reply =
          '🛡️ We offer a 7-Day Hassle-Free Replacement & Refund Policy! If an item is damaged, defective, or incorrect, contact our hotline (01735126250) or support team for immediate return pickup and 100% refund.';
        replyOptions = ['Talk to human agent', 'Payment rules'];
      } else if (q.includes('honey') || q.includes('sundarban') || q.includes('mustard') || q.includes('oil')) {
        reply =
          '🍯 Yes! Our Sundarban Wild Honey is 100% raw, unfiltered, and ethically harvested from mangrove forests. Our Mustard Oil is wood-pressed (Ghani) cold-extracted with zero preservatives!';
        replyOptions = ['Show Pr2 Groceries', 'What are delivery fees?'];
      } else if (q.includes('panjabi') || q.includes('saree') || q.includes('clothing')) {
        reply =
          '✨ Our Pr1 collection features 100% combed Egyptian cotton Panjabis with handcrafted collar embroidery, and authentic Rajshahi pure Mulberry silk sarees.';
      } else {
        reply =
          'Thank you for reaching out! For any urgent queries regarding order verification, payment confirmation, or custom orders, our 24/7 hotline is 01735126250.';
        replyOptions = ['Payment instructions', 'Shipping times', 'Return policy'];
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: reply, options: replyOptions }]);
    }, 400);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-2 bg-[#E53935] hover:bg-red-700 text-white px-4 py-3 rounded-full shadow-2xl transition-all transform hover:scale-105"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          <span className="text-xs font-black tracking-wide hidden sm:inline">
            SaiMx Help & AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px] animate-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-[#E53935] flex items-center justify-center font-bold text-white shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black flex items-center space-x-1.5">
                  <span>SaiMx Smart Support</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded-full font-bold">
                    Online
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">Instant answers 24/7</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick FAQ shortcuts banner */}
          <div className="bg-[#FDFBF7] px-3 py-2 border-b border-slate-100 flex items-center space-x-2 text-[10px] text-slate-600 overflow-x-auto">
            <span className="font-bold text-[#E53935] shrink-0">⚡ Quick:</span>
            <button
              onClick={() => handleSend('What are delivery times for Dhaka vs outside?')}
              className="bg-white border border-slate-200 px-2 py-0.5 rounded-full shrink-0 hover:border-red-300"
            >
              Shipping Times
            </button>
            <button
              onClick={() => handleSend('How does the 150 TK delivery payment work?')}
              className="bg-white border border-slate-200 px-2 py-0.5 rounded-full shrink-0 hover:border-red-300"
            >
              150 TK Rule
            </button>
            <button
              onClick={() => handleSend('What is your return & refund policy?')}
              className="bg-white border border-slate-200 px-2 py-0.5 rounded-full shrink-0 hover:border-red-300"
            >
              7-Day Returns
            </button>
          </div>

          {/* Message History */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FDFBF7]/40 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#E53935] text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>

                {/* Option Suggestion Chips */}
                {m.options && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(opt)}
                        className="text-[11px] bg-white border border-slate-200 text-slate-700 hover:border-red-300 hover:text-[#E53935] px-2.5 py-1 rounded-full transition-colors text-left shadow-2xs"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about orders, delivery, bKash..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E53935]"
            />
            <button
              type="submit"
              className="p-2 bg-[#E53935] hover:bg-red-700 text-white rounded-xl transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
