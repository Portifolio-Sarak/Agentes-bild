import React from 'react';
import './Introduction.css';

export const Introduction: React.FC = () => {
    return (
        <div className="introduction-container">
            <header className="intro-header">
                <h1 className="intro-title">Ecossistema de Inteligência Artificial</h1>
                <p className="intro-subtitle">Plataforma de Agentes Especialistas</p>
            </header>

            <div className="intro-content">
                <section className="intro-section">
                    <h2 className="section-title">O Sistema</h2>
                    <p className="section-text">
                        O sistema foi desenvolvido para superar as limitações convencionais dos modelos de linguagem em chats, focando em continuidade cognitiva e consistência de personalidade através de duas frentes principais:
                    </p>
                </section>

                <section className="intro-section card-box">
                    <h2 className="section-title">1. Agentes Especialistas com Memória de Longo Prazo</h2>
                    <p className="section-text">
                        Este módulo soluciona os desafios críticos da "amnésia" de contexto e da diluição de identidade que ocorrem em conversas extensas:
                    </p>
                    <div className="sub-section">
                        <h3 className="sub-title">Persistência de Contexto via RAG</h3>
                        <p className="sub-text">
                            Utilizamos o banco de dados vetorial <strong>ChromaDB</strong> para implementar uma arquitetura de memória semântica.
                            O sistema processa o histórico em ciclos: as mensagens são transformadas em vetores (embeddings) e armazenadas,
                            permitindo que o agente recupere informações relevantes de meses atrás por similaridade,
                            mantendo o contexto imediato na janela de atenção da LLM.
                        </p>
                    </div>
                    <div className="sub-section">
                        <h3 className="sub-title">Preservação de Identidade Dinâmica</h3>
                        <p className="sub-text">
                            Diferente de chats comuns que "esquecem" suas diretrizes ao longo do tempo, o sistema conta com um mecanismo de re-injeção de identidade.
                            O <em>System Prompt</em> é gerenciado de forma que o agente sempre revalide quem ele é e seu propósito,
                            garantindo uma persona consistente independentemente da duração da sessão.
                        </p>
                    </div>
                </section>

                <section className="intro-section card-box">
                    <h2 className="section-title">2. Roteamento Inteligente e Orquestração de APIs</h2>
                    <p className="section-text">
                        Através de um dashboard centralizado, o sistema atua como um orquestrador de modelos (Model Router):
                    </p>
                    <div className="sub-section">
                        <h3 className="sub-title">Seleção Otimizada</h3>
                        <p className="sub-text">
                            O motor de busca analisa em tempo real o melhor custo-benefício entre múltiplas fontes (Google Gemini, OpenRouter ou provedores locais).
                            O roteamento é baseado em latência, limite de tokens e custo operacional, enviando a consulta para a API mais eficiente.
                        </p>
                    </div>
                    <div className="tech-stack">
                        <strong>Tecnologias de Suporte:</strong> FastAPI (Backend), ChromaDB (Vetorial), Sentence-Transformers (Embeddings), Gemini (LLM) e PostgreSQL (Persistência).
                    </div>
                </section>

                <section className="intro-section card-box">
                    <h2 className="section-title">3. Dashboard LLM: Inteligência de Catálogo</h2>
                    <p className="section-text">
                        Interface de gestão automatizada para curadoria de inteligência artificial de ponta:
                    </p>
                    <div className="sub-section">
                        <h3 className="sub-title">Catalogação Automatizada</h3>
                        <p className="sub-text">
                            Ingestão dinâmica de modelos via OpenRouter API, mantendo o catálogo atualizado com metadados críticos
                            como contexto, capacidades multimodais e precificação em tempo real.
                        </p>
                    </div>
                    <div className="sub-section">
                        <h3 className="sub-title">Seleção baseada em Elo Score</h3>
                        <p className="sub-text">
                            Utilização de dados do <em>LMSYS Chatbot Arena</em> para classificar modelos por performance real.
                            O sistema seleciona automaticamente o modelo com a melhor nota para tarefas específicas, com atualizações periódicas a cada 3 horas.
                        </p>
                    </div>
                </section>

                <section className="intro-section card-box highlighted-section">
                    <h2 className="section-title">4. Democracia Digital: Zero Code (Em construção)</h2>
                    <p className="section-text">
                        Evolução para que a complexidade de criar automações seja totalmente absorvida pela IA através de uma experiência dialógica:
                    </p>
                    <div className="sub-section">
                        <h3 className="sub-title">Chat de Auxílio à Criação (Arquiteto de IA)</h3>
                        <p className="sub-text">
                            O usuário conversa com o assistente, que interpreta intenções e decide quais Agentes e Workflows são necessários, montando tudo de forma invisível.
                        </p>
                    </div>
                    <div className="sub-section">
                        <h3 className="sub-title">Workflows Orientados por Intenção</h3>
                        <p className="sub-text">
                            O usuário define o objetivo final e o sistema orquestra o fluxo de trabalho e ferramentas via <strong>MCP (Model Context Protocol)</strong>,
                            sem necessidade de conhecimentos em programação.
                        </p>
                    </div>
                </section>
            </div>

            <footer className="intro-footer-clean">
                <p>Desenvolvido para máxima eficiência e acessibilidade.</p>
            </footer>
        </div>
    );
};
