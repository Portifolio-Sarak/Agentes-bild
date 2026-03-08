import React, { useState, useEffect } from 'react';
import './WorkflowEditor.css';
import axios from 'axios';

interface MCPTool {
    id: string;
    name: string;
    display_name: string;
    category: string;
    description: string;
    runtime: string;
    config_schema: any;
}

interface FlowNode {
    id: string;
    type: 'trigger' | 'brain' | 'tool' | 'logic' | 'wait';
    label: string;
    icon: string;
    position: { x: number; y: number };
    data: any;
}

interface FlowEdge {
    id: string;
    source: string;
    target: string;
}

interface AgentBlueprint {
    name: string;
    version: string;
    description: string;
    nodes: FlowNode[];
    edges: FlowEdge[];
    settings: {
        brain_model: string;
        temperature: number;
        memory_type: string;
        context_window: number;
    };
    resilience: {
        retries: number;
        human_approval: boolean;
    };
}

export const WorkflowEditor: React.FC = () => {
    const [tools, setTools] = useState<MCPTool[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
    const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [toolSearch, setToolSearch] = useState('');

    // Estado do Blueprint (O Workflow sendo montado)
    const [blueprint, setBlueprint] = useState<AgentBlueprint>({
        name: "Automação Inteligente",
        version: "1.0.0",
        description: "Workflow sequencial com IA.",
        nodes: [
            {
                id: 'node-0',
                type: 'trigger',
                label: 'Gatilho (Webhook)',
                icon: '⚡',
                position: { x: 50, y: 150 },
                data: { type: 'webhook' }
            }
        ],
        edges: [],
        settings: {
            brain_model: "openai/gpt-4o",
            temperature: 0.7,
            memory_type: 'short-term',
            context_window: 10
        },
        resilience: {
            retries: 3,
            human_approval: false
        }
    });

    const API_BASE = 'http://localhost:8000';

    useEffect(() => {
        const initFactory = async () => {
            await fetchTools();
        };
        initFactory();
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

    const templates = [
        {
            id: 'support',
            name: 'Chatbot de Atendimento',
            icon: '💬',
            description: 'Focado em responder clientes e salvar logs.',
            tools: ['mcp-server-google-sheets', 'mcp-server-slack']
        },
        {
            id: 'web',
            name: 'Agente de Pesquisa Web',
            icon: '🌐',
            description: 'Especialista em busca profunda e síntese.',
            tools: ['firecrawl', 'mcp-server-puppeteer']
        },
        {
            id: 'finance',
            name: 'Analista Financeiro',
            icon: '💰',
            description: 'Monitora mercado e gera relatórios.',
            tools: ['binance-mcp', 'mcp-server-notion']
        }
    ];

    const removeEdge = (edgeId: string) => {
        setBlueprint(prev => ({
            ...prev,
            edges: prev.edges.filter(e => e.id !== edgeId)
        }));
    };

    const exportBlueprint = () => {
        const n8nBlueprint = {
            nodes: blueprint.nodes.map(node => ({
                id: node.id,
                name: node.label,
                type: `n8n-nodes-base.${node.type === 'trigger' ? 'webhook' : node.type === 'brain' ? 'aiAgent' : 'httpRequest'}`,
                typeVersion: 1,
                position: [node.position.x, node.position.y],
                parameters: node.data
            })),
            connections: blueprint.edges.reduce((acc: any, edge) => {
                const source = blueprint.nodes.find(n => n.id === edge.source);
                const target = blueprint.nodes.find(n => n.id === edge.target);
                if (source && target) {
                    if (!acc[source.label]) acc[source.label] = { main: [[]] };
                    acc[source.label].main[0].push({
                        node: target.label,
                        type: 'main',
                        index: 0
                    });
                }
                return acc;
            }, {}),
            settings: blueprint.settings,
            meta: {
                name: blueprint.name,
                version: blueprint.version
            }
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(n8nBlueprint, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${blueprint.name.toLowerCase().replace(/ /g, '_')}_n8n.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Blueprint exportado no formato n8n.`]);
    };

    const addLogicNode = () => {
        const newNode: FlowNode = {
            id: `node-${Date.now()}`,
            type: 'logic',
            label: 'IF/ELSE Lógica',
            icon: '⚖️',
            position: { x: 350, y: 250 },
            data: { condition: '{{result}} === "ok"' }
        };
        setBlueprint(prev => ({ ...prev, nodes: [...prev.nodes, newNode] }));
    };

    const applyTemplate = (template: any) => {
        const selectedTools = tools.filter(t => template.tools.includes(t.name));
        const newNodes: FlowNode[] = [
            { id: 'node-0', type: 'trigger', label: 'Gatilho', icon: '⚡', position: { x: 50, y: 150 }, data: { type: 'webhook' } },
            { id: 'node-1', type: 'brain', label: template.id === 'finance' ? 'Analista Sênior' : 'Assistente IA', icon: '🧠', position: { x: 250, y: 150 }, data: { prompt: '' } }
        ];

        selectedTools.forEach((tool, i) => {
            newNodes.push({
                id: `node-tool-${i}`,
                type: 'tool',
                label: tool.display_name,
                icon: '🛠️',
                position: { x: 450 + (i * 200), y: 150 },
                data: tool
            });
        });

        setBlueprint({
            ...blueprint,
            name: template.name,
            description: template.description,
            nodes: newNodes,
            edges: newNodes.slice(0, -1).map((n, i) => ({
                id: `edge-${i}`,
                source: n.id,
                target: newNodes[i + 1].id
            }))
        });
    };

    const addToolToFlow = (tool: MCPTool) => {
        const newNode: FlowNode = {
            id: `node-${Date.now()}`,
            type: 'tool',
            label: tool.display_name,
            icon: '🛠️',
            position: { x: 250, y: 150 },
            data: tool
        };
        setBlueprint(prev => ({
            ...prev,
            nodes: [...prev.nodes, newNode]
        }));
    };

    const addBrainNode = () => {
        const newNode: FlowNode = {
            id: `node-${Date.now()}`,
            type: 'brain',
            label: 'Cérebro (IA)',
            icon: '🧠',
            position: { x: 450, y: 150 },
            data: {}
        };
        setBlueprint(prev => ({
            ...prev,
            nodes: [...prev.nodes, newNode]
        }));
    };

    const addWaitNode = () => {
        const newNode: FlowNode = {
            id: `node-${Date.now()}`,
            type: 'wait',
            label: 'Aguardar 24h',
            icon: '⏳',
            position: { x: 550, y: 250 },
            data: { delay: '24h' }
        };
        setBlueprint(prev => ({ ...prev, nodes: [...prev.nodes, newNode] }));
    };

    const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
        const node = blueprint.nodes.find(n => n.id === nodeId);
        if (node) {
            setDraggingNodeId(nodeId);
            setDragOffset({
                x: e.clientX - node.position.x,
                y: e.clientY - node.position.y
            });
        }
    };

    const handleCanvasMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });

        if (draggingNodeId) {
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;

            setBlueprint(prev => ({
                ...prev,
                nodes: prev.nodes.map(n => n.id === draggingNodeId ? { ...n, position: { x: newX, y: newY } } : n)
            }));
        }
    };

    const handleCanvasMouseUp = () => {
        setDraggingNodeId(null);
    };

    const handleNodeClick = (nodeId: string) => {
        if (connectingNodeId) {
            if (connectingNodeId !== nodeId) {
                if (!blueprint.edges.find(e => e.source === connectingNodeId && e.target === nodeId)) {
                    const newEdge: FlowEdge = {
                        id: `edge-${Date.now()}`,
                        source: connectingNodeId,
                        target: nodeId
                    };
                    setBlueprint(prev => ({ ...prev, edges: [...prev.edges, newEdge] }));
                }
            }
            setConnectingNodeId(null);
        } else {
            setSelectedNodeId(nodeId);
        }
    };

    const startConnection = (e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        setConnectingNodeId(nodeId);
    };

    const removeNode = (nodeId: string) => {
        setBlueprint(prev => ({
            ...prev,
            nodes: prev.nodes.filter(n => n.id !== nodeId),
            edges: prev.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
        }));
    };

    const clearSelection = () => {
        setSelectedNodeId(null);
        setConnectingNodeId(null);
    };

    const handleImportN8N = () => {
        // setIsImportModalOpen(true); 
    };

    const categories = Array.from(new Set(tools.map(t => t.category)));

    return (
        <div className="mcp-factory-container workflow-mode">
            <div className="mcp-factory-header">
                <div className="title-area">
                    <h1>Editor de Workflows</h1>
                    <p>Construa automações complexas conectando agentes e ferramentas.</p>
                </div>
            </div>

            <div className="utility-bar">
                <button className="btn-utility" onClick={exportBlueprint}>📤 Exportar JSON</button>
            </div>

            <div className="templates-bar">
                <h3>Templates:</h3>
                <div className="template-list">
                    {templates.map(t => (
                        <button key={t.id} className="template-card" onClick={() => applyTemplate(t)}>
                            <span className="template-icon">{t.icon}</span>
                            <div className="template-info">
                                <strong>{t.name}</strong>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mcp-factory-content">
                {/* Canvas ocupa 100% agora */}
                <div className="canvas-section full-width">
                    <div className="canvas-main">
                        <div className="canvas-header">
                            <div className="blueprint-name">
                                <input
                                    type="text"
                                    value={blueprint.name}
                                    onChange={(e) => setBlueprint({ ...blueprint, name: e.target.value })}
                                />
                            </div>
                            <div className="canvas-actions">
                                <button className="btn-secondary" onClick={() => setBlueprint({
                                    name: "Automação",
                                    version: "1.0.0",
                                    description: "Workflow sequencial com IA.",
                                    nodes: [
                                        { id: 'node-0', type: 'trigger', label: 'Gatilho de Entrada', icon: '⚡', position: { x: 50, y: 150 }, data: { type: 'webhook' } }
                                    ],
                                    edges: [],
                                    settings: {
                                        brain_model: "openai/gpt-4o",
                                        temperature: 0.7,
                                        memory_type: 'short-term',
                                        context_window: 10
                                    },
                                    resilience: { retries: 3, human_approval: false }
                                })}>Limpar</button>
                                <button className="btn-primary" onClick={() => setIsVersionModalOpen(true)}>🚀 Publicar V{blueprint.version}</button>
                            </div>
                        </div>

                        <div
                            className="diagram-canvas agent-flow-canvas"
                            onMouseMove={handleCanvasMouseMove}
                            onMouseUp={handleCanvasMouseUp}
                            onMouseLeave={handleCanvasMouseUp}
                            onClick={clearSelection}
                        >
                            <svg className="flow-lines">
                                {blueprint.edges.map(edge => {
                                    const sourceNode = blueprint.nodes.find(n => n.id === edge.source);
                                    const targetNode = blueprint.nodes.find(n => n.id === edge.target);
                                    if (!sourceNode || !targetNode) return null;

                                    const x1 = sourceNode.position.x + 180;
                                    const y1 = sourceNode.position.y + 45;
                                    const x2 = targetNode.position.x;
                                    const y2 = targetNode.position.y + 45;
                                    const dx = Math.abs(x2 - x1) * 0.5;
                                    const midX = x1 + (x2 - x1) / 2;
                                    const midY = y1 + (y2 - y1) / 2;

                                    return (
                                        <g key={edge.id} className="workflow-edge-group">
                                            <path
                                                d={`M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`}
                                                fill="transparent"
                                                stroke="#3b82f6"
                                                strokeWidth="2"
                                                strokeDasharray="5,5"
                                                className="workflow-edge-path"
                                            />
                                            <circle cx={x2} cy={y2} r="4" fill="#3b82f6" />
                                            <g className="edge-delete-btn" onClick={(e) => { e.stopPropagation(); removeEdge(edge.id); }} style={{ cursor: 'pointer' }}>
                                                <circle cx={midX} cy={midY} r="8" fill="#ef4444" />
                                                <text x={midX} y={midY} textAnchor="middle" dy=".3em" fill="white" fontSize="12px" style={{ pointerEvents: 'none' }}>×</text>
                                            </g>
                                        </g>
                                    );
                                })}

                                {connectingNodeId && (
                                    <path
                                        d={`M ${(blueprint.nodes.find(n => n.id === connectingNodeId)?.position.x || 0) + 180} ${(blueprint.nodes.find(n => n.id === connectingNodeId)?.position.y || 0) + 45} L ${mousePosition.x} ${mousePosition.y}`}
                                        fill="transparent"
                                        stroke="#fbbf24"
                                        strokeWidth="3"
                                        strokeDasharray="5,5"
                                        style={{ pointerEvents: 'none' }}
                                    />
                                )}
                            </svg>

                            {blueprint.nodes.map((node) => (
                                <div
                                    key={node.id}
                                    className={`flow-node ${node.type} ${selectedNodeId === node.id ? 'active' : ''} ${connectingNodeId === node.id ? 'connecting' : ''}`}
                                    style={{
                                        left: `${node.position.x}px`,
                                        top: `${node.position.y}px`,
                                        cursor: draggingNodeId === node.id ? 'grabbing' : 'grab'
                                    }}
                                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                                    onClick={(e) => { e.stopPropagation(); handleNodeClick(node.id); }}
                                >
                                    <button className="remove-node" onClick={(e) => { e.stopPropagation(); removeNode(node.id); }}>×</button>

                                    <div className="node-content">
                                        <div className="node-main-info">
                                            <div className="node-icon">{node.icon}</div>
                                            <div className="node-text">
                                                <span className="node-label">{node.label}</span>
                                                {node.type === 'brain' && (
                                                    <div className="node-sub-badges">
                                                        <span className="inner-badge">🧠 IA</span>
                                                        <span className="inner-badge">💾 MEM</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="node-handle right"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={(e) => startConnection(e, node.id)}
                                        title="Ligar ponto"
                                    />
                                    <div
                                        className="node-handle left"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={(e) => { e.stopPropagation(); handleNodeClick(node.id); }}
                                        title="Ponto de entrada"
                                    />
                                </div>
                            ))}

                            {blueprint.nodes.length === 0 && (
                                <div className="canvas-hint">Adicione <button onClick={addBrainNode}>Cérebro</button> ou ferramentas para iniciar.</div>
                            )}

                            <div className="canvas-controls" style={{ position: 'absolute', bottom: '20px', left: '20px', display: 'flex', gap: '8px' }}>
                                <button className="btn-utility" onClick={addBrainNode}>+ 🧠 Agente (Cérebro+Mem)</button>
                                <button className="btn-utility" onClick={addLogicNode}>+ ⚖️ Lógica</button>
                                <button className="btn-utility" onClick={addWaitNode}>+ ⏳ Espera</button>
                            </div>
                        </div>

                        <div className="tool-catalogue">
                            <div className="tool-catalogue-header">
                                <h3>Ferramentas Disponíveis</h3>
                                <div className="tool-search-box">
                                    <input
                                        type="text"
                                        placeholder="Buscar ferramenta (ex: Gmail, Slack...)"
                                        value={toolSearch}
                                        onChange={(e) => setToolSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="category-accordion">
                                {categories.filter(cat => {
                                    if (!toolSearch) return true;
                                    return tools.some(t => t.category === cat && t.display_name.toLowerCase().includes(toolSearch.toLowerCase()));
                                }).map(cat => (
                                    <div key={cat} className="category-item">
                                        <div
                                            className={`category-trigger ${activeCategory === cat || toolSearch ? 'active' : ''}`}
                                            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                                        >
                                            <span>{cat}</span>
                                            <span className="chevron">{activeCategory === cat || toolSearch ? '▼' : '▶'}</span>
                                        </div>
                                        {(activeCategory === cat || toolSearch) && (
                                            <div className="tool-grid">
                                                {tools.filter(t => t.category === cat && t.display_name.toLowerCase().includes(toolSearch.toLowerCase())).map(tool => (
                                                    <div key={tool.id} className="tool-item">
                                                        <div className="tool-meta">
                                                            <strong>{tool.display_name}</strong>
                                                            <p>{tool.description.substring(0, 40)}...</p>
                                                        </div>
                                                        <button className="btn-add-tool" onClick={() => addToolToFlow(tool)}>
                                                            +
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
