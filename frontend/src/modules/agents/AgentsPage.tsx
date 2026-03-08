import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, Trash2, Bot, Info, Shield } from 'lucide-react';
import agentApi, { AgentResponse } from '../../shared/services/agentService';
import ExpandableCard from '../../core/components/ExpandableCard';

const AgentsPage: React.FC = () => {
    const [agents, setAgents] = useState<AgentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAgent, setNewAgent] = useState({
        name: '',
        description: '',
        base_prompt: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            setLoading(true);
            const data = await agentApi.listAgents();
            setAgents(data);
        } catch (error) {
            console.error('Erro ao buscar agentes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAgent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await agentApi.createAgent(newAgent);
            setIsModalOpen(false);
            setNewAgent({ name: '', description: '', base_prompt: '' });
            fetchAgents();
        } catch (error) {
            console.error('Erro ao criar agente:', error);
        }
    };

    const startSession = async (agentId: string) => {
        try {
            const session = await agentApi.createSession(agentId);
            navigate(`/agents/chat/${session.id}`);
        } catch (error) {
            console.error('Erro ao iniciar sessão:', error);
        }
    };

    const handleDeleteAgent = async (agentId: string) => {
        if (!window.confirm('Tem certeza que deseja remover este especialista?')) return;
        try {
            await agentApi.deleteAgent(agentId);
            fetchAgents();
        } catch (error) {
            console.error('Erro ao deletar agente:', error);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-theme-card/50 p-8 rounded-3xl border border-theme-border backdrop-blur-sm shadow-theme">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-theme-title tracking-tight flex items-center gap-3">
                        <Bot className="w-10 h-10 text-theme-primary" />
                        Especialistas RAG
                    </h1>
                    <p className="text-theme-muted text-lg max-w-xl">
                        Gerencie e interaja com seus agentes de inteligência especializados em seus dados.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-theme-primary text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-theme-primary/20 cursor-pointer"
                >
                    <Plus className="w-5 h-5" />
                    Criar Novo Especialista
                </button>
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-theme-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-theme-muted font-bold tracking-widest uppercase text-xs">Carregando Especialistas...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map((agent) => (
                        <ExpandableCard
                            key={agent.id}
                            title={agent.name}
                            iconContent={<Bot className="w-4 h-4" />}
                            baseHeight={240}
                            className="hover:border-theme-primary/50 transition-colors"
                        >
                            <div className="flex flex-col h-full justify-between">
                                <div className="space-y-4">
                                    <p className="text-theme-muted text-sm line-clamp-3 leading-relaxed">
                                        {agent.description || 'Sem descrição definida para este agente.'}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-theme-primary/60 uppercase tracking-tighter">
                                        <Shield className="w-3 h-3" />
                                        RAG Ativo
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-6 border-t border-theme-border/50">
                                    <button
                                        onClick={() => startSession(agent.id)}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-theme-primary/10 text-theme-primary hover:bg-theme-primary hover:text-white rounded-xl font-bold transition-all text-sm cursor-pointer"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        Iniciar Chat
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAgent(agent.id)}
                                        className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                                        title="Remover Agente"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </ExpandableCard>
                    ))}

                    {agents.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-theme-card border-2 border-dashed border-theme-border rounded-3xl opacity-60">
                            <Bot className="w-16 h-16 mx-auto mb-4 text-theme-muted" />
                            <h3 className="text-xl font-bold text-theme-title">Nenhum agente encontrado</h3>
                            <p className="text-theme-muted">Comece criando seu primeiro especialista agora mesmo.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-theme-body/80 backdrop-blur-md"
                        onClick={() => setIsModalOpen(false)}
                    ></div>
                    <div className="relative w-full max-w-lg bg-theme-card border border-theme-border rounded-[2.5rem] shadow-2xl p-8 space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-theme-title tracking-tight flex items-center gap-2">
                                <Plus className="w-6 h-6 text-theme-primary" />
                                Novo Especialista
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-theme-secondary/20 rounded-full transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateAgent} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-theme-muted uppercase tracking-widest ml-1">Nome do Agente</label>
                                <input
                                    type="text"
                                    value={newAgent.name}
                                    onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                                    className="w-full bg-theme-body border border-theme-border p-4 rounded-2xl focus:border-theme-primary outline-none transition-all placeholder:text-theme-muted/40 font-medium"
                                    placeholder="Ex: Arquiteto de Software, Guia de Paris..."
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-theme-muted uppercase tracking-widest ml-1">Descrição</label>
                                <input
                                    type="text"
                                    value={newAgent.description}
                                    onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                                    className="w-full bg-theme-body border border-theme-border p-4 rounded-2xl focus:border-theme-primary outline-none transition-all placeholder:text-theme-muted/40 font-medium"
                                    placeholder="Para que serve este especialista?"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-theme-muted uppercase tracking-widest ml-1">System Prompt</label>
                                <textarea
                                    value={newAgent.base_prompt}
                                    onChange={(e) => setNewAgent({ ...newAgent, base_prompt: e.target.value })}
                                    rows={4}
                                    className="w-full bg-theme-body border border-theme-border p-4 rounded-2xl focus:border-theme-primary outline-none transition-all placeholder:text-theme-muted/40 font-medium resize-none"
                                    placeholder="Defina a personalidade e as regras do seu agente..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-theme-primary text-white font-bold rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-theme-primary/20 cursor-pointer mt-4"
                            >
                                Criar Agente
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Simple X icon as it might not be imported
const X = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default AgentsPage;
