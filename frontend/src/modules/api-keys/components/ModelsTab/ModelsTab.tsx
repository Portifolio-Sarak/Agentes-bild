import React, { useState, useEffect } from 'react';
import { Star, Trophy, Globe, Lock, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { CatalogStatusResponse, ApiKeyStatus, modelCatalogApi } from '@/shared/services/api';
interface ApiKey {
    id: string;
    service: string;
    key: string;
    isActive: boolean;
    status?: ApiKeyStatus | null;
    checkingStatus?: boolean;
}

interface ModelsTabProps {
    apiKeys: ApiKey[];
    catalogStatus: CatalogStatusResponse | null;
    userPrefs: any;
    onSyncCatalog: () => Promise<void>;
}

export const ModelsTab = ({
    apiKeys,
    catalogStatus,
    userPrefs,
    onSyncCatalog
}: ModelsTabProps) => {
    const [selectedActivity, setSelectedActivity] = useState<string>('all');
    const [filterByPrefs, setFilterByPrefs] = useState<boolean>(false);
    const [catalogModels, setCatalogModels] = useState<any[]>([]);
    const [loadingCatalog, setLoadingCatalog] = useState<boolean>(false);

    useEffect(() => {
        const loadCatalog = async () => {
            try {
                setLoadingCatalog(true);
                const res = await modelCatalogApi.listModels();
                setCatalogModels(res.models || []);
            } catch (err) {
                console.error("Erro ao carregar catálogo:", err);
            } finally {
                setLoadingCatalog(false);
            }
        };
        loadCatalog();
    }, []);

    const categoryLabels: { [key: string]: string } = {
        'text': '📝 Escrita (Geral)',
        'reasoning': '🧠 Raciocínio (o1/R1)',
        'audio': '🎵 Áudio',
        'image': '🖼️ Imagem (Geração)',
        'video': '🎬 Vídeo',
        'code': '💻 Código',
        'multimodal': '🌐 Multimodal (Vision)',
        'long_context': '📚 Longo Contexto (1M+)',
        'translation': '🔤 Tradução',
        'creative': '✍️ Criativo',
        'structured': '📊 Dados Estruturados',
        'small_model': '⚡ Baixa Latência'
    };

    const categoryOrder = [
        'multimodal', 'reasoning', 'code', 'long_context',
        'text', 'image', 'video', 'audio',
        'translation', 'creative', 'structured', 'small_model'
    ];

    const getFilteredModels = () => {
        // Mapeia modelos ativos por nome para busca rápida
        const activeModelsMap: { [key: string]: any } = {};
        apiKeys.forEach(key => {
            if (key.status && key.status.models_status) {
                key.status.models_status.forEach(m => {
                    const name = m.name.toLowerCase();
                    if (!activeModelsMap[name]) {
                        activeModelsMap[name] = m;
                    }
                });
            }
        });

        // Constrói a lista final baseada no CATÁLOGO COMPLETO
        let finalModels = catalogModels.map((catMode: any) => {
            const activeModel = activeModelsMap[catMode.display_name.toLowerCase()] ||
                activeModelsMap[catMode.id.toLowerCase()];

            return {
                ...catMode,
                name: catMode.display_name,
                available: activeModel?.available || false,
                blocked: activeModel?.blocked || false,
                status: activeModel?.status || 'not_configured',
                tier: activeModel?.tier || catMode.tier || 'unknown',
                // Preserva preços se o modelo estiver ativo
                input_price: activeModel?.input_price || 0,
                output_price: activeModel?.output_price || 0,
                // Prioriza notas do catálogo
                elo_rating: catMode.elo_rating || activeModel?.elo_rating,
                performance_score: catMode.performance_score,
                win_rate: catMode.win_rate,
                total_votes: catMode.total_votes,
                organization: catMode.organization,
                capabilities: catMode.capabilities || []
            };
        });

        // Se não houver catálogo ainda (vazio), usa apenas os modelos ativos como fallback
        if (finalModels.length === 0) {
            finalModels = Object.values(activeModelsMap);
        }

        // 1. Filtro por Atividade (selectedActivity)
        let filteredModels = finalModels;
        if (selectedActivity !== 'all') {
            filteredModels = filteredModels.filter((m: any) => {
                const cat = m.category || 'text';
                return cat === selectedActivity || (selectedActivity === 'text' && !m.category);
            });
        }

        // 2. Filtro por Preferências (filterByPrefs)
        if (filterByPrefs && userPrefs) {
            const mode = userPrefs.usage_mode || 'free';
            if (mode === 'free') {
                filteredModels = filteredModels.filter((m: any) => m.tier === 'free');
            } else {
                const strategyKey = `${selectedActivity === 'all' ? 'global' : selectedActivity}_strategy`;
                const strategy = userPrefs[strategyKey] || userPrefs.global_strategy || 'performance';
                if (strategy === 'free') {
                    filteredModels = filteredModels.filter((m: any) => m.tier === 'free');
                }
            }
        }

        return filteredModels;
    };

    // Calcula categorias e contagem de modelos para os filtros
    const getCategoryCounts = () => {
        const models = getFilteredModels(); // Pega a lista completa atual
        const counts: { [key: string]: number } = { all: models.length };
        models.forEach((m: any) => {
            const cat = m.category || 'text';
            counts[cat] = (counts[cat] || 0) + 1;
        });

        return counts;
    };

    const categoryCounts = getCategoryCounts();
    const availableCategories = categoryOrder.filter(c => (categoryCounts[c] || 0) > 0);

    const renderModelList = () => {
        const filteredModels = getFilteredModels();

        // Agrupa por categoria
        const grouped: { [key: string]: any[] } = {};
        filteredModels.forEach((model: any) => {
            const cat = model.category || 'text';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(model);
        });

        return categoryOrder.map(category => {
            const models = grouped[category];
            if (!models || models.length === 0) return null;

            return (
                <div key={category} className="model-category-group" style={{ marginBottom: '24px' }}>
                    <div className="model-category-header" style={{
                        borderBottom: '2px solid var(--border-color)',
                        paddingBottom: '8px',
                        marginBottom: '12px',
                        fontSize: '1.2rem'
                    }}>
                        {categoryLabels[category] || category}
                    </div>
                    <div className="models-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '12px'
                    }}>
                        {models.map((model: any, idx: number) => (
                            <div key={`${model.name}-${idx}`} className={`model-item ${model.status}`} style={{
                                padding: '16px',
                                borderRadius: '16px',
                                backgroundColor: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'black', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '2px' }}>{model.name}</div>
                                        {model.organization && (
                                            <div style={{ fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {model.organization}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                                        {model.elo_rating && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                backgroundColor: 'rgba(250, 204, 21, 0.1)',
                                                padding: '2px 8px',
                                                borderRadius: '6px',
                                                color: '#facc15',
                                                fontSize: '0.7rem',
                                                fontWeight: 'black'
                                            }} title="Chatbot Arena Elo Rating">
                                                <Trophy className="w-3 h-3" />
                                                {Math.round(model.elo_rating)}
                                            </div>
                                        )}
                                        {model.performance_score && (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                                padding: '2px 8px',
                                                borderRadius: '6px',
                                                color: '#3b82f6',
                                                fontSize: '0.7rem',
                                                fontWeight: 'black'
                                            }} title="Hugging Face Open LLM Score">
                                                <Globe className="w-3 h-3" />
                                                {model.performance_score.toFixed(1)}%
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    <div className="model-badge" style={{
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold',
                                        padding: '4px 8px',
                                        borderRadius: '8px',
                                        backgroundColor: model.available ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: model.available ? '#10b981' : '#ef4444'
                                    }}>
                                        {model.available ? '✅ Disponível' : '❌ Não Configurado'}
                                    </div>
                                    {model.tier === 'free' ? (
                                        <div style={{ fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                                            <Zap className="w-3 h-3 inline mr-1" /> GRÁTIS
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                                            PAGO
                                        </div>
                                    )}
                                </div>
                                {model.tier === 'free' && (
                                    <div className="model-tier-info" style={{ fontSize: '0.8rem', opacity: 0.9, color: '#10b981', fontWeight: 'bold' }}>
                                        🆓 Grátis
                                    </div>
                                )}
                                {model.tier === 'paid' && model.available && (
                                    <div className="model-tier-info" style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                                        <div style={{ fontSize: '0.7rem', marginTop: '2px', color: 'var(--text-secondary)' }}>
                                            In: <strong>${((model.input_price || 0) * 1000000).toFixed(2)}</strong> / 1M
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                            Out: <strong>${((model.output_price || 0) * 1000000).toFixed(2)}</strong> / 1M
                                        </div>
                                    </div>
                                )}
                                <div style={{ fontSize: '0.65rem', opacity: 0.5, marginTop: 'auto', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{model.license_type || 'Licença Proprietária'}</span>
                                    <span>Via: {model.available ? "Chaves Ativas" : "N/A"}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        });
    };

    const hasActiveKeys = apiKeys.some(k => k.status && k.status.is_valid);

    return (
        <div className="models-tab">
            {/* Filtros de Visualização */}
            <div className="api-dashboard-filters" style={{
                padding: '20px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '12px',
                marginBottom: '20px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                alignItems: 'center',
                border: '1px solid var(--border-color)'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Filtro por Categoria:</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setSelectedActivity('all')}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '20px',
                                border: '1px solid var(--border-color)',
                                background: selectedActivity === 'all' ? 'var(--primary-color)' : 'var(--bg-card)',
                                color: selectedActivity === 'all' ? 'white' : 'var(--text-primary)',
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                            }}
                        >
                            Todos ({categoryCounts.all})
                        </button>
                        {availableCategories.map(activity => (
                            <button
                                key={activity}
                                onClick={() => setSelectedActivity(activity)}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    border: '1px solid var(--border-color)',
                                    background: selectedActivity === activity ? 'var(--primary-color)' : 'var(--bg-card)',
                                    color: selectedActivity === activity ? 'white' : 'var(--text-primary)',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                {(categoryLabels[activity] || activity).replace(/ \(.*\)/, '')} ({categoryCounts[activity] || 0})
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="checkbox"
                        id="filterByPrefs"
                        checked={filterByPrefs}
                        onChange={(e) => setFilterByPrefs(e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="filterByPrefs" style={{ fontWeight: '600', cursor: 'pointer', color: 'var(--text-primary)' }}>
                        Filtrar por minhas preferências
                    </label>
                </div>
            </div>

            {/* Notificação sobre status do catálogo */}
            {catalogStatus && (!catalogStatus.api_available || catalogStatus.using_mock_data || catalogStatus.api_error) && (
                <div className="catalog-warning" style={{
                    padding: '12px 16px',
                    marginBottom: '20px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-warning, #fff3cd)',
                    border: '1px solid var(--border-warning, #ffc107)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <span style={{ fontSize: '20px' }}>⚠️</span>
                    <div style={{ flex: 1 }}>
                        <strong>Catálogo de Modelos:</strong>
                        {catalogStatus.using_mock_data && (
                            <div>API do Chatbot Arena não disponível. Usando dados mockados.</div>
                        )}
                        {catalogStatus.api_error && !catalogStatus.using_mock_data && (
                            <div>{catalogStatus.api_error}</div>
                        )}
                        {!catalogStatus.is_populated && (
                            <div>Catálogo ainda não foi populado.</div>
                        )}
                        {catalogStatus.total_models > 0 && (
                            <div style={{ fontSize: '0.9em', marginTop: '4px', opacity: 0.8 }}>
                                {catalogStatus.total_models} modelo(s) cadastrado(s)
                            </div>
                        )}
                    </div>
                    <button
                        onClick={async () => {
                            try {
                                await onSyncCatalog();
                                alert('Catálogo sincronizado com sucesso!');
                            } catch (error: any) {
                                alert('Erro ao sincronizar catálogo: ' + (error.response?.data?.detail || error.message));
                            }
                        }}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-warning, #ffc107)',
                            backgroundColor: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer'
                        }}
                    >
                        Sincronizar
                    </button>
                </div>
            )}

            {/* Grid de Modelos */}
            {loadingCatalog && catalogModels.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-theme-primary mb-4" />
                    <p className="text-theme-muted">Carregando catálogo completo...</p>
                </div>
            ) : (
                <div className="models-list-container">
                    {renderModelList()}
                </div>
            )}
        </div>
    );
};
