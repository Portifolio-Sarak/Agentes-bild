import { useState, useEffect } from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import { ApiKeyManager } from '../ApiKeyManager/ApiKeyManager';
import { ApiUsage } from '../ApiUsage/ApiUsage';
import { ModelPreferences } from '../ModelPreferences/ModelPreferences';

import AgentsManager from '../Agents/AgentsManager';
import AgentChatView from '../Agents/AgentChatView';
import { MCPFactory } from '../MCPFactory/MCPFactory';

import { WorkflowEditor } from '../Workflow/WorkflowEditor';
import { Introduction } from '../Introduction/Introduction';

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const MainApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isTestUser = user?.email === 'usuario@teste.com';

  // Sincroniza activeTab com a URL ou estado interno
  const [activeTab, setActiveTabState] = useState('introducao');

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    navigate(`/app/${tab}`);
  };

  // Efeito para sincronizar tab ativa baseada na URL
  useEffect(() => {
    const segments = location.pathname.split('/');
    // Formato esperado: /app/:tab/...
    const tabName = segments[2];
    if (tabName && ['introducao', 'agents', 'mcp-factory', 'api-keys', 'workflows'].includes(tabName)) {
      setActiveTabState(tabName);
    }
  }, [location]);
  const [apiKeysSubTab, setApiKeysSubTab] = useState<'keys' | 'usage' | 'preferences'>('keys');

  const renderDevOverlay = () => (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{
        background: 'rgba(30, 41, 59, 0.9)',
        padding: '32px',
        borderRadius: '16px',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        boxShadow: '0 0 40px rgba(0,0,0,0.5)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚧</div>
        <h2 style={{
          color: '#f8fafc',
          marginBottom: '8px',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>Em Desenvolvimento</h2>
        <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
          Esta funcionalidade está sendo construída e estará disponível em breve para testes.
        </p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'introducao':
        return (
          <div className="tab-content" style={{ padding: 0 }}>
            <Introduction />
          </div>
        );

      case 'agents':
        return (
          <div className="tab-content" style={{ position: 'relative' }}>
            <AgentsManager />
          </div>
        );

      case 'mcp-factory':
        return (
          <div className="tab-content">
            <MCPFactory />
          </div>
        );

      case 'workflows':
        return (
          <div className="tab-content">
            <WorkflowEditor />
          </div>
        );

      case 'api-keys':
        return (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Dashboard LLM</h2>
              <p>Configure suas chaves de API e monitore seu uso</p>
            </div>

            {/* Sub-abas */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '24px',
              borderBottom: '2px solid var(--border-color)'
            }}>
              <button
                onClick={() => setApiKeysSubTab('keys')}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: apiKeysSubTab === 'keys' ? '3px solid #7c3aed' : '3px solid transparent',
                  color: apiKeysSubTab === 'keys' ? '#7c3aed' : 'var(--text-secondary)',
                  fontWeight: apiKeysSubTab === 'keys' ? '600' : '400',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
              >
                🔑 Chaves de API
              </button>
              <button
                onClick={() => setApiKeysSubTab('usage')}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: apiKeysSubTab === 'usage' ? '3px solid #7c3aed' : '3px solid transparent',
                  color: apiKeysSubTab === 'usage' ? '#7c3aed' : 'var(--text-secondary)',
                  fontWeight: apiKeysSubTab === 'usage' ? '600' : '400',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
              >
                📊 Uso e Cota
              </button>
              <button
                onClick={() => setApiKeysSubTab('preferences')}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: apiKeysSubTab === 'preferences' ? '3px solid #7c3aed' : '3px solid transparent',
                  color: apiKeysSubTab === 'preferences' ? '#7c3aed' : 'var(--text-secondary)',
                  fontWeight: apiKeysSubTab === 'preferences' ? '600' : '400',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
              >
                ⚙️ Preferências
              </button>
            </div>

            {/* Conteúdo das sub-abas */}
            {apiKeysSubTab === 'keys' && <ApiKeyManager />}
            {apiKeysSubTab === 'usage' && <ApiUsage />}
            {apiKeysSubTab === 'preferences' && <ModelPreferences />}
          </div>
        );

      default:
        return null;
    }
  };

  const showDevOverlay = isTestUser && (activeTab === 'mcp-factory' || activeTab === 'workflows');

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="app-main">
        <div className="app-content" style={{ position: 'relative', height: '100%' }}>
          {showDevOverlay && renderDevOverlay()}
          <Routes>
            <Route path="agents/chat/:sessionId" element={<AgentChatView />} />
            <Route path="*" element={renderTabContent()} />
          </Routes>
        </div>
      </main>
    </div>
  );
};
