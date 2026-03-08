import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Workflow, Play, Save, Download, Plus, Zap, Brain, Wrench, Clock, Database, GitBranch, Settings, History, Layers } from 'lucide-react';
import ExpandableCard from '../../core/components/ExpandableCard';

const API_BASE = 'http://localhost:8000';

const WorkflowPage: React.FC = () => {
    const [tools, setTools] = useState<any[]>([]);
    const [blueprint, setBlueprint] = useState<any>({
        name: "Automação Inteligente",
        version: "1.0.0",
        nodes: [
            { id: 'node-0', type: 'trigger', label: 'Webhook Entrada', icon: '⚡', position: { x: 50, y: 150 }, data: { type: 'webhook' } }
        ],
        edges: []
    });

    useEffect(() => {
        const fetchTools = async () => {
            try {
                const response = await axios.get(`${API_BASE}/mcp/tools`);
                setTools(response.data);
            } catch (e) { }
        };
        fetchTools();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-theme-card p-6 rounded-3xl border border-theme-border shadow-theme">
                <div>
                    <h1 className="text-3xl font-black text-theme-title tracking-tight flex items-center gap-2">
                        <Workflow className="w-8 h-8 text-theme-primary" />
                        Editor de Workflows
                    </h1>
                    <p className="text-theme-muted text-sm font-medium">Conecte agentes e ferramentas em sequências lógicas complexas.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-theme-body border border-theme-border rounded-xl text-xs font-black uppercase text-theme-muted hover:text-theme-primary transition-all">
                        <History className="w-3.5 h-3.5" />
                        Histórico
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-theme-primary text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-theme-primary/20 hover:scale-105 transition-all">
                        <Save className="w-3.5 h-3.5" />
                        Publicar Workflow
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Templates & Tools Sidebar */}
                <div className="xl:col-span-3 space-y-4">
                    <ExpandableCard title="Blocos de Construção" iconContent={<Layers className="w-4 h-4" />} helpButton={null}>
                        <div className="space-y-3">
                            <span className="text-[9px] font-black text-theme-muted uppercase tracking-widest">Nós de Sistema</span>
                            <div className="space-y-2">
                                <div className="p-3 bg-theme-body border border-theme-border rounded-xl flex items-center gap-3 cursor-grab hover:border-theme-primary transition-colors">
                                    <Zap className="w-4 h-4 text-theme-primary" />
                                    <span className="text-[10px] font-black uppercase">Gatilho (Webhook)</span>
                                </div>
                                <div className="p-3 bg-theme-body border border-theme-border rounded-xl flex items-center gap-3 cursor-grab hover:border-theme-primary transition-colors">
                                    <Brain className="w-4 h-4 text-purple-500" />
                                    <span className="text-[10px] font-black uppercase">Agente Cognitivo</span>
                                </div>
                                <div className="p-3 bg-theme-body border border-theme-border rounded-xl flex items-center gap-3 cursor-grab hover:border-theme-primary transition-colors">
                                    <GitBranch className="w-4 h-4 text-amber-500" />
                                    <span className="text-[10px] font-black uppercase">Lógica Condicional</span>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <span className="text-[9px] font-black text-theme-muted uppercase tracking-widest">Ferramentas MCP</span>
                                <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                    {tools.slice(0, 10).map((tool: any) => (
                                        <div key={tool.id} className="p-2.5 bg-theme-body border border-theme-border rounded-xl flex items-center gap-3 cursor-grab hover:border-theme-primary transition-colors opacity-80 hover:opacity-100">
                                            <Wrench className="w-3 h-3 text-theme-muted" />
                                            <span className="text-[9px] font-bold truncate">{tool.display_name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ExpandableCard>
                </div>

                {/* Workflow Canvas */}
                <div className="xl:col-span-9">
                    <div className="bg-theme-card p-1 rounded-[2.5rem] border border-theme-border shadow-inner-theme h-[650px] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-grid-pattern-lg opacity-[0.02] pointer-events-none"></div>

                        {/* Fake Canvas Content for now, Visual Editor Integration is next step */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity duration-1000">
                            <Workflow className="w-16 h-16 text-theme-primary/10 mb-4 animate-pulse" />
                            <h3 className="text-sm font-black text-theme-muted uppercase tracking-[0.3em]">Ambiente de Fluxo</h3>
                        </div>

                        {/* Node Elements Simulation */}
                        <div className="absolute top-20 left-20 p-5 bg-theme-body border-2 border-theme-primary rounded-2xl shadow-xl z-10 w-48">
                            <div className="flex items-center gap-3 mb-2">
                                <Zap className="w-5 h-5 text-theme-primary" />
                                <span className="text-[10px] font-black uppercase">Gatilho HTTP</span>
                            </div>
                            <div className="h-1 bg-theme-border rounded-full w-full mb-3"></div>
                            <div className="text-[8px] font-bold text-theme-muted">URL: /api/webhook/v1/trigger</div>
                        </div>

                        <div className="absolute top-48 left-80 p-5 bg-theme-body border-2 border-purple-500 rounded-2xl shadow-xl z-10 w-48">
                            <div className="flex items-center gap-3 mb-2">
                                <Brain className="w-5 h-5 text-purple-500" />
                                <span className="text-[10px] font-black uppercase">Agente Sênior</span>
                            </div>
                            <div className="h-1 bg-theme-border rounded-full w-full mb-3"></div>
                            <div className="text-[8px] font-bold text-theme-muted truncate">PROMPT: Analisar dados recebidos...</div>
                        </div>

                        {/* Connections simulation would be SVGs here */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                            <path d="M 280 120 C 350 120, 310 215, 380 215" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkflowPage;
