import React from 'react';
import './Introduction.css';

const Introduction: React.FC = () => {
    return (
        <div className="introduction-container h-full overflow-y-auto custom-scrollbar p-8">
            <header className="intro-header mb-12 text-center lg:text-left">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic mb-2">
                    Ecossistema de Inteligência Artificial
                </h1>
                <p className="text-blue-500 font-bold uppercase tracking-widest text-sm">
                    Plataforma de Agentes Especialistas
                </p>
            </header>

            <div className="intro-content grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="intro-section lg:col-span-2">
                    <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-blue-600 pl-4 uppercase tracking-wider">
                        O Sistema
                    </h2>
                    <p className="text-slate-400 leading-relaxed text-lg">
                        O sistema foi desenvolvido para superar as limitações convencionais dos modelos de linguagem em chats, focando em continuidade cognitiva e consistência de personalidade através de duas frentes principais:
                    </p>
                </section>

                <section className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl hover:border-blue-500/30 transition-all group">
                    <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs">1</span>
                        Agentes Especialistas
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                Persistência via RAG
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Utilizamos o banco de dados vetorial <strong>ChromaDB</strong> para implementar uma arquitetura de memória semântica.
                                O sistema permite recuperar informações de meses atrás por similaridade.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                Identidade Dinâmica
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Diferente de chats comuns, o sistema conta com um mecanismo de re-injeção de identidade, garantindo uma persona consistente.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl hover:border-blue-500/30 transition-all group">
                    <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs">2</span>
                        Orquestração de APIs
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                Seleção Otimizada
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                O motor de busca analisa em tempo real o melhor custo-benefício entre múltiplas fontes (Google Gemini, OpenRouter ou provedores locais).
                            </p>
                        </div>
                        <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                            <strong className="text-xs text-blue-300 uppercase tracking-widest block mb-1">Tech Stack:</strong>
                            <p className="text-[10px] text-slate-500 font-medium">
                                FastAPI, ChromaDB, Sentence-Transformers, Gemini, PostgreSQL.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl lg:col-span-2">
                    <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-xs">3</span>
                        Dashboard LLM: Inteligência de Catálogo
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                        <p className="text-slate-400 leading-relaxed">
                            Ingestão dinâmica de modelos via OpenRouter API, mantendo o catálogo atualizado com capacidades multimodais e precificação em tempo real.
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            Utilização de dados do <em>LMSYS Chatbot Arena</em> para classificar modelos por performance (Elo Score), com atualizações a cada 3 horas.
                        </p>
                    </div>
                </section>
            </div>

            <footer className="mt-12 pt-8 border-t border-slate-900 text-center text-slate-600 text-[10px] uppercase font-bold tracking-[0.2em]">
                Sarak AI Ecosystem &copy; 2026 • Desenvolvido para máxima eficiência
            </footer>
        </div>
    );
};

export default Introduction;
