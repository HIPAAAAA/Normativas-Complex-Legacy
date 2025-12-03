import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { factionService } from '../services/factionService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hola, soy la IA de Complex Legacy. ¿Tienes dudas sobre alguna normativa?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
        // Init AI
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Get Context
        const context = await factionService.getAllRulesContext();
        
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: userMsg,
          config: {
            systemInstruction: context + "\n\nResponde de manera concisa, útil y amable. Si la respuesta no está en las normativas, di que no tienes esa información.",
          }
        });

        const responseText = response.text || "No pude generar una respuesta.";

        setMessages(prev => [...prev, { role: 'model', text: responseText }]);

    } catch (error) {
        console.error("AI Error:", error);
        setMessages(prev => [...prev, { role: 'model', text: "Lo siento, hubo un error al conectar con la base de datos neuronal." }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 h-[500px] bg-[#0f0f12]/95 backdrop-blur-xl border border-accent/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-accent-deep to-[#0f0f12] border-b border-white/10 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]" />
                <span className="font-display font-bold text-white tracking-widest text-sm">LEGACY AI ASSISTANT</span>
                <button onClick={() => setIsOpen(false)} className="ml-auto text-white/50 hover:text-white">✕</button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                            msg.role === 'user' 
                            ? 'bg-accent text-white rounded-br-none shadow-lg shadow-accent/20' 
                            : 'bg-white/5 text-gray-200 border border-white/10 rounded-bl-none'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 p-3 rounded-2xl rounded-bl-none border border-white/10 flex gap-1">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75" />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10 bg-black/20">
                <form 
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2"
                >
                    <input 
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-accent placeholder-gray-600"
                        placeholder="Pregunta sobre normativas..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button 
                        type="submit"
                        className="p-2 bg-accent rounded-xl text-white hover:bg-white hover:text-accent transition-colors disabled:opacity-50"
                        disabled={isLoading}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-14 h-14 bg-gradient-to-br from-accent to-accent-deep rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(140,120,255,0.4)] hover:shadow-[0_0_50px_rgba(140,120,255,0.6)] hover:scale-110 transition-all duration-300 border border-white/20"
      >
        <div className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-20" />
        {isOpen ? (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        ) : (
             <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )}
      </button>
    </div>
  );
};

export default AiAssistant;