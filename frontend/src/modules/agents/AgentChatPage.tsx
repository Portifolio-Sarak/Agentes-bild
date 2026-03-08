import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Bot, User, Paperclip, Loader2 } from 'lucide-react';
import agentApi, { AgentChatMessage } from '../../shared/services/agentService';

const AgentChatPage: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<AgentChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionInfo, setSessionInfo] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (sessionId) {
            fetchSessionAndMessages();
        }
    }, [sessionId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchSessionAndMessages = async () => {
        if (!sessionId) return;
        try {
            const [sessionData, messageData] = await Promise.all([
                agentApi.getSession(sessionId),
                agentApi.getMessages(sessionId)
            ]);
            setSessionInfo(sessionData);
            setMessages(messageData);
        } catch (error) {
            console.error('Erro ao buscar dados do chat:', error);
            navigate('/agents');
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !sessionId || loading) return;

        const userMessage = input.trim();
        setInput('');
        setLoading(true);

        try {
            const response = await agentApi.sendMessage(sessionId, userMessage);
            setMessages(prev => [...prev, response]);
            // Refresh sessions info if needed
            fetchSessionAndMessages();
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Chat Header */}
            <div className="flex items-center justify-between bg-theme-card/80 backdrop-blur-md p-4 rounded-2xl border border-theme-border shadow-theme sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/agents')}
                        className="p-2 hover:bg-theme-secondary/20 rounded-xl transition-all cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5 text-theme-muted" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-theme-primary/20 rounded-full flex items-center justify-center border border-theme-primary/30">
                            <Bot className="w-6 h-6 text-theme-primary" />
                        </div>
                        <div>
                            <h2 className="font-black text-theme-title text-sm uppercase tracking-widest leading-none">
                                {sessionInfo?.agent?.name || 'Agente Especialista'}
                            </h2>
                            <span className="text-[9px] font-bold text-theme-primary uppercase">Em Sessão Ativa</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-6 p-4 custom-scrollbar min-h-0">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${msg.role === 'user'
                                ? 'bg-theme-card border-theme-border'
                                : 'bg-theme-primary border-theme-primary shadow-lg shadow-theme-primary/20'
                            }`}>
                            {msg.role === 'user' ? (
                                <User className="w-5 h-5 text-theme-title" />
                            ) : (
                                <Bot className="w-5 h-5 text-white" />
                            )}
                        </div>
                        <div className={`max-w-[80%] space-y-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-theme-secondary/10 text-theme-title border border-theme-border rounded-tr-none'
                                    : 'bg-theme-card text-theme-main border border-theme-border rounded-tl-none'
                                }`}>
                                {msg.content}
                            </div>
                            <span className="text-[10px] font-medium text-theme-muted px-1">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-theme-primary flex items-center justify-center border border-theme-primary shadow-lg animate-pulse">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-theme-card border border-theme-border p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-theme-primary rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-theme-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-theme-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            </div>
                            <span className="text-xs font-bold text-theme-muted uppercase tracking-widest">Processando...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-theme-card border border-theme-border rounded-3xl shadow-2xl relative group focus-within:border-theme-primary transition-all duration-300">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                        }
                    }}
                    placeholder="Envie uma mensagem ou anexe um documento..."
                    className="w-full bg-transparent p-4 pr-32 outline-none font-medium text-theme-main placeholder:text-theme-muted/40 min-h-[60px] max-h-[200px] resize-none scroll-m-0"
                    rows={1}
                />
                <div className="absolute right-4 bottom-4 flex items-center gap-2">
                    <button
                        type="button"
                        className="p-3 text-theme-muted hover:text-theme-primary hover:bg-theme-primary/10 rounded-xl transition-all cursor-pointer"
                        title="Anexar Documento"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className={`p-3 rounded-xl transition-all shadow-lg cursor-pointer ${!input.trim() || loading
                                ? 'bg-theme-muted/20 text-theme-muted cursor-not-allowed opacity-50'
                                : 'bg-theme-primary text-white hover:scale-105 active:scale-95 shadow-theme-primary/30'
                            }`}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AgentChatPage;
