-- Script de Inicialização para Sarak Agentes
-- Este script cria todas as tabelas necessárias para o sistema de agentes
-- Banco de dados alvo: Agents_workflow

-- Habilitar extensão UUID caso não esteja habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Tabela de Chaves de API
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service VARCHAR(50) NOT NULL,
    encrypted_key TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_user_service_key UNIQUE (user_id, service)
);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);

-- Tabela de Uso de Tokens
CREATE TABLE IF NOT EXISTS token_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    requests INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_token_usage_user_id ON token_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_token_usage_service_model ON token_usage(service, model);
CREATE INDEX IF NOT EXISTS idx_token_usage_created_at ON token_usage(created_at);

-- Catálogo de Modelos
CREATE TABLE IF NOT EXISTS model_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    canonical_name JSONB DEFAULT '[]' NOT NULL,
    display_name VARCHAR(200) NOT NULL,
    elo_rating FLOAT,
    elo_confidence_interval_lower FLOAT,
    elo_confidence_interval_upper FLOAT,
    performance_score FLOAT,
    win_rate FLOAT,
    total_votes INTEGER DEFAULT 0,
    category VARCHAR(50),
    license_type VARCHAR(50),
    organization VARCHAR(100),
    aliases JSONB DEFAULT '[]' NOT NULL,
    capabilities JSONB DEFAULT '["text_input"]' NOT NULL,
    source VARCHAR(50) DEFAULT 'chatbot_arena' NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_model_catalog_elo ON model_catalog(elo_rating);
CREATE INDEX IF NOT EXISTS idx_model_catalog_category ON model_catalog(category);
CREATE INDEX IF NOT EXISTS idx_model_catalog_is_active ON model_catalog(is_active);
CREATE INDEX IF NOT EXISTS idx_model_catalog_license_elo ON model_catalog(license_type, elo_rating);

-- Mapeamento de Modelos por Provedor
CREATE TABLE IF NOT EXISTS model_provider_mapping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID NOT NULL REFERENCES model_catalog(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_model_id VARCHAR(200) NOT NULL,
    pricing_info JSONB,
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    last_verified TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT unique_provider_model UNIQUE (provider, provider_model_id)
);
CREATE INDEX IF NOT EXISTS idx_model_provider_model_id ON model_provider_mapping(model_id);
CREATE INDEX IF NOT EXISTS idx_model_provider_available ON model_provider_mapping(provider, is_available);

-- Tabela de Agentes (Especialistas)
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_prompt TEXT NOT NULL,
    configuration JSONB DEFAULT '{}' NOT NULL,
    vector_namespace VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);

-- Sessões de Conversa dos Agentes
CREATE TABLE IF NOT EXISTS agent_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    summary TEXT,
    message_count INTEGER DEFAULT 0,
    last_interaction TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_agent_id ON agent_sessions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_sessions_user_id ON agent_sessions(user_id);

-- Mensagens do Chat dos Agentes
CREATE TABLE IF NOT EXISTS agent_chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES agent_sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    metadata_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_agent_chat_messages_session_id ON agent_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_agent_chat_messages_created_at ON agent_chat_messages(created_at);

-- Documentos Associados para RAG
CREATE TABLE IF NOT EXISTS agent_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES agent_sessions(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'processing',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_agent_documents_session_id ON agent_documents(session_id);

-- Ferramentas MCP (Model Context Protocol)
CREATE TABLE IF NOT EXISTS mcp_tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    runtime VARCHAR(20) NOT NULL,
    command VARCHAR(500) NOT NULL,
    config_schema JSONB DEFAULT '{}' NOT NULL,
    metadata_json JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_mcp_tools_category ON mcp_tools(category);

-- Vínculo entre Agentes e Ferramentas MCP
CREATE TABLE IF NOT EXISTS agent_tool_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    tool_id UUID NOT NULL REFERENCES mcp_tools(id) ON DELETE CASCADE,
    encrypted_credentials TEXT,
    is_enabled BOOLEAN DEFAULT TRUE,
    last_verified TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_agent_tool_links_agent_id ON agent_tool_links(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_tool_links_tool_id ON agent_tool_links(tool_id);
