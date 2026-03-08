import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Bot, Key, Activity, Settings, Workflow, Palette, Shield } from 'lucide-react';

// SARAK CORE
import { ThemeProvider } from './core/contexts/ThemeContext';
import { AuthProvider, useAuth } from './core/auth/AuthContext';
import SarakShell from './core/components/SarakShell';
import ProtectedRoute from './core/auth/ProtectedRoute';
import Login from './core/auth/Login';
import { ModuleSelector } from './core/components/Controls';
import GoogleTranslateWidget from './core/components/GoogleTranslateWidget';

// MÓDULOS (Conteúdo do Projeto)
import Introduction from './modules/system/Introduction';
import LayoutSelector from './core/components/LayoutSelector';
import AgentsPage from './modules/agents/AgentsPage';
import AgentChatPage from './modules/agents/AgentChatPage';
import ApiKeysPage from './modules/api-keys/ApiKeysPage';
import McpFactoryPage from './modules/mcp/McpFactoryPage';
import WorkflowPage from './modules/workflows/WorkflowPage';

const SarakConfig = {
  branding: {
    name: "Sarak Agentes",
    version: "v2.5.0",
    logoPath: "logo.png"
  },
  navigation: [
    { id: 'introduction', label: 'Introdução', icon: <Activity className="w-4 h-4" /> },
    { id: 'api-keys', label: 'Dashboard LLM', icon: <Key className="w-4 h-4" /> },
    { id: 'agents', label: 'Especialistas RAG', icon: <Bot className="w-4 h-4" /> },
    { id: 'mcp-factory', label: 'Agentes', icon: <Box className="w-4 h-4" /> },
    { id: 'workflows', label: 'Workflows', icon: <Workflow className="w-4 h-4" /> },
    { id: 'theme', label: 'Tema', icon: <Palette className="w-4 h-4" /> },
    { id: 'settings', label: 'Configurações', icon: <Settings className="w-4 h-4" /> },
  ]
};

const AppContent = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('introduction');
  const [currentModule, setCurrentModule] = useState('rag-engine');

  const renderContent = (tab: string) => {
    switch (tab) {
      case 'introduction':
        return <Introduction />;
      case 'theme':
        return <LayoutSelector />;
      case 'agents':
        return <AgentsPage />;
      case 'api-keys':
        return <ApiKeysPage />;
      case 'mcp-factory':
        return <McpFactoryPage />;
      case 'workflows':
        return <WorkflowPage />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-slate-900/40 border border-slate-800 rounded-3xl shadow-2xl">
            <h1 className="text-2xl font-black text-white mb-4 uppercase tracking-[0.2em] italic">Módulo em Migração</h1>
            <p className="text-slate-400 max-w-md font-medium text-sm leading-relaxed">
              Esta funcionalidade (<span className="text-blue-500">{tab}</span>) está sendo refinada para a nova arquitetura premium.
              As funcionalidades originais estarão disponíveis em breve.
            </p>
            <div className="mt-8 px-6 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest animate-pulse">
              Optimization in Progress
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <GoogleTranslateWidget />
      <Routes>
        <Route path="/login" element={<Login branding={{ name: "Sarak Agents", version: "v2.0.0", subtitle: "Especialistas RAG" }} />} />
        <Route path="/agents/chat/:sessionId" element={
          <ProtectedRoute>
            <div className="h-screen bg-theme-body p-6">
              <AgentChatPage />
            </div>
          </ProtectedRoute>
        } />
        <Route path="/*" element={
          <ProtectedRoute>
            <SarakShell
              config={SarakConfig}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              renderContent={renderContent}
              user={user}
              onLogout={logout}
              onPasswordModal={() => console.log("Password Modal")}
            />
          </ProtectedRoute>
        } />
        {/* Redirect for legacy paths */}
        <Route path="/app/*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  </AuthProvider>
);

export default App;
