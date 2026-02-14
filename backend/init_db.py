"""
Script para inicializar o banco de dados
Execute: python init_db.py
"""
from app.database import engine, Base
from app.models.database import ApiKey, TokenUsage, User
from app.modules.agents.core_llm.models.models import ModelCatalog, ModelProviderMapping
from app.modules.agents.factory.models.models import Agent, AgentSession, AgentChatMessage, AgentDocument
from app.modules.agents.mcp.models.models import MCPTool, AgentToolLink

if __name__ == "__main__":
    print("Criando tabelas no banco de dados...")
    Base.metadata.create_all(bind=engine)
    print("Tabelas criadas com sucesso!")
