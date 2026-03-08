import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Save, Download, Trash2, Plus, Zap, Brain, Wrench, Scale, Clock, MessageSquare, Settings2, Share2, FileJson, FileUp, ChevronDown, ChevronRight, Search } from 'lucide-react';
import ExpandableCard from '../../core/components/ExpandableCard';

const API_BASE = 'http://localhost:8000';

const McpFactoryPage = () => {
    const [tools, setTools] = useState<any[]>([]);
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);
    const [blueprint, setBlueprint] = useState({
        name: "Automação Inteligente",
        version: "1.0.0",
        nodes: [{ id: 'node-0', type: 'trigger', label: 'Gatilho', icon: 'zap', position: { x: 50, y: 150 }, data: { type: 'webhook' } }],
        edges: [],
        settings: { brain_model: "google/gemini-2.0-flash-exp:free", memory_type: 'short-term' }
    });

    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        try {
            await axios.post(`${API_BASE}/mcp/tools/seed`);
            const response = await axios.get(`${API_BASE}/mcp/tools`);
            setTools(response.data);
        } catch (error) {
            console.error('Erro ao buscar ferramentas:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;
        setChatHistory((prev) => [...prev, { role: 'user', content: inputValue }]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_BASE}/mcp/assistant/chat`, {
                message: inputValue,
                history: chatHistory,
                model_name: blueprint.settings.brain_model,
                blueprint: blueprint
            });
            setChatHistory((prev) => [...prev, { role: 'assistant', content: response.data.response }]);
        } catch (error) {
            setChatHistory((prev) => [...prev, { role: 'assistant', content: "Erro ao contatar assistente." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-theme-card p-6 rounded-3xl border border-theme-border shadow-theme">
                <div>
                    <h1 className="text-3xl font-black text-theme-title tracking-tight flex items-center gap-2">
                        <Brain className="w-8 h-8 text-theme-primary" />
                        Fábrica de Agentes
                    </h1>
                    <p className="text-theme-muted text-sm font-medium">Configure inteligência e ferramentas MCP para seus agentes.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-theme-body border border-theme-border rounded-xl text-xs font-black uppercase text-theme-muted hover:text-theme-primary transition-all cursor-pointer">
                        <FileUp className="w-3.5 h-3.5" />
                        Importar
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-theme-primary text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-theme-primary/20 hover:scale-105 transition-all cursor-pointer">
                        <Play className="w-3.5 h-3.5" />
                        Testar Fluxo
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Assistant Chat */}
                <div className="xl:col-span-4 space-y-4">
                    <ExpandableCard title="Copiloto de Arquitetura" iconContent={<MessageSquare className="w-4 h-4" />}>
                        <div className="flex flex-col h-[500px]">
                            <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar p-2">
                                <div className="bg-theme-body/50 p-3 rounded-2xl text-xs text-theme-muted border border-theme-border leading-relaxed">
                                    Olá! Sou seu assistente de design. Posso ajudar você a escolher as melhores ferramentas para este agente.
                                </div>
                                {chatHistory.map((msg, i) => (
                                    <div key={i} className={`p-3 rounded-2xl text-xs border ${msg.role === 'user'
                                        ? 'bg-theme-primary/5 border-theme-primary/20 ml-8 text-theme-title font-bold text-right'
                                        : 'bg-theme-card border-theme-border mr-8 text-theme-muted'
                                        }`}>
                                        {msg.content}
                                    </div>
                                ))}
                                {isLoading && <div className="text-[10px] font-black text-theme-primary animate-pulse ml-2 uppercase tracking-widest">IA processando...</div>}
                            </div>
                            <div className="mt-4 pt-4 border-t border-theme-border">
                                <div className="relative">
                                    <input
                                        className="w-full bg-theme-body border border-theme-border rounded-xl py-3 pl-4 pr-12 text-xs font-medium text-theme-title focus:outline-none focus:ring-2 focus:ring-theme-primary/20 transition-all placeholder:text-theme-muted/50"
                                        placeholder="Peça ajuda para configurar um nó..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="absolute right-2 top-2 p-1.5 bg-theme-primary text-white rounded-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </ExpandableCard>
                </div>

                {/* Canvas Placeholder */}
                <div className="xl:col-span-8 space-y-6 text-theme-title">
                    <div className="bg-theme-card p-12 rounded-[2.5rem] border border-theme-border shadow-inner-theme min-h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
                        <div className="relative z-10 space-y-6">
                            <div className="w-24 h-24 bg-theme-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-theme-primary/20 group-hover:scale-110 transition-transform duration-700">
                                <Settings2 className="w-10 h-10 text-theme-primary animate-spin-slow" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-widest italic text-theme-title">Editor Visual Ativo</h2>
                            <p className="text-theme-muted max-w-sm mx-auto text-sm font-medium leading-relaxed">
                                {`O blueprint "${blueprint.name}" está sendo sincronizado. Você pode adicionar ferramentas do catálogo abaixo.`}
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <div className="px-4 py-2 bg-theme-body border border-theme-border rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase">
                                    <Zap className="w-3 h-3 text-amber-500" /> Gatilho
                                </div>
                                <div className="px-4 py-2 bg-theme-body border border-theme-border rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase">
                                    <Brain className="w-3 h-3 text-purple-500" /> Cérebro IA
                                </div>
                                <div className="px-4 py-2 bg-theme-body border border-theme-border rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase">
                                    <Wrench className="w-3 h-3 text-blue-500" /> Ferramentas
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tools Catalogue */}
                    <ExpandableCard title="Catálogo de Ferramentas MCP" iconContent={<Wrench className="w-4 h-4" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {tools.map((tool) => (
                                <div key={tool.id} className="p-4 bg-theme-body border border-theme-border rounded-2xl hover:border-theme-primary transition-all group cursor-pointer shadow-sm hover:shadow-theme-primary/10">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-2 bg-theme-card rounded-xl border border-theme-border text-theme-primary group-hover:bg-theme-primary group-hover:text-white transition-colors">
                                            <Wrench className="w-4 h-4" />
                                        </div>
                                        <span className="text-[8px] font-black text-theme-muted uppercase bg-theme-card px-2 py-0.5 rounded-full border border-theme-border">
                                            {tool.category}
                                        </span>
                                    </div>
                                    <h4 className="font-black text-theme-title text-sm mb-1">{tool.display_name}</h4>
                                    <p className="text-[10px] text-theme-muted font-bold line-clamp-2 leading-tight opacity-70">
                                        {tool.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </ExpandableCard>
                </div>
            </div>
        </div>
    );
};

export default McpFactoryPage;
