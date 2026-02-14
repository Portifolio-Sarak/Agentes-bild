import logging
from typing import List, Optional
from sqlalchemy.orm import Session
from app.modules.agents.mcp.models.models import MCPTool

logger = logging.getLogger(__name__)

class ToolService:
    """
    Serviço para gerenciar o catálogo de ferramentas MCP.
    """
    
    def __init__(self, db: Session):
        self.db = db

    def list_tools(self, category: Optional[str] = None) -> List[MCPTool]:
        """Lista ferramentas por categoria ou todas."""
        query = self.db.query(MCPTool).filter(MCPTool.is_active == True)
        if category:
            query = query.filter(MCPTool.category == category)
        return query.all()

    def get_tool_by_name(self, name: str) -> Optional[MCPTool]:
        """Busca ferramenta pelo nome único."""
        return self.db.query(MCPTool).filter(MCPTool.name == name).first()

    def register_custom_tool(self, tool_data: dict) -> MCPTool:
        """
        Registra uma nova ferramenta customizada no catálogo.
        Verifica se já existe pelo nome.
        """
        existing = self.get_tool_by_name(tool_data["name"])
        if existing:
            raise ValueError(f"Ferramenta com nome '{tool_data['name']}' já existe.")
        
        new_tool = MCPTool(
            name=tool_data["name"],
            display_name=tool_data["display_name"],
            category=tool_data.get("category", "Custom"),
            description=tool_data.get("description", ""),
            runtime=tool_data.get("runtime", "node"), # Default to node
            command=tool_data["command"],
            config_schema=tool_data.get("config_schema", {}),
            metadata_json=tool_data.get("metadata_json", {"cost": "Unknown", "source": "Custom"}),
            is_active=True
        )
        self.db.add(new_tool)
        self.db.commit()
        self.db.refresh(new_tool)
        return new_tool

    async def seed_tools(self):
        """
        Popula o banco de dados com as ferramentas iniciais planejadas.
        """
        initial_tools = [
            # 🌐 Web Auto & Scraping
            {
                "name": "firecrawl",
                "display_name": "Firecrawl",
                "category": "🌐 Web Auto & Scraping",
                "description": "Extração de conteúdo de sites limpa, convertida diretamente para Markdown.",
                "runtime": "api",
                "command": "https://api.firecrawl.dev",
                "config_schema": {
                    "required": ["FIRECRAWL_API_KEY"],
                    "properties": {
                        "FIRECRAWL_API_KEY": {"type": "string", "title": "API Key do Firecrawl"}
                    }
                },
                "metadata_json": {"cost": "Free/Paid", "link": "https://firecrawl.dev"}
            },
            {
                "name": "mcp-server-puppeteer",
                "display_name": "Puppeteer/Playwright",
                "category": "🌐 Web Auto & Scraping",
                "description": "Navegação automatizada e captura de prints usando o motor do Chromium.",
                "runtime": "node",
                "command": "npx -y @modelcontextprotocol/server-puppeteer",
                "config_schema": {},
                "metadata_json": {"cost": "Free", "link": "https://github.com/modelcontextprotocol/servers"}
            },
            # 💬 Comunicação
            {
                "name": "mcp-server-slack",
                "display_name": "Slack",
                "category": "💬 Comunicação",
                "description": "Integração para envio de mensagens e leitura de canais no Slack.",
                "runtime": "node",
                "command": "npx -y @modelcontextprotocol/server-slack",
                "config_schema": {
                    "required": ["SLACK_BOT_TOKEN"],
                    "properties": {
                        "SLACK_BOT_TOKEN": {"type": "string", "title": "Bot User OAuth Token"}
                    }
                },
                "metadata_json": {"cost": "Free"}
            },
            {
                "name": "mcp-server-discord",
                "display_name": "Discord",
                "category": "💬 Comunicação",
                "description": "Integração para bots de Discord.",
                "runtime": "node",
                "command": "npx -y @modelcontextprotocol/server-discord",
                "config_schema": {
                    "required": ["DISCORD_BOT_TOKEN"],
                    "properties": {
                        "DISCORD_BOT_TOKEN": {"type": "string", "title": "Discord Bot Token"}
                    }
                },
                "metadata_json": {"cost": "Free"}
            },
            # 📅 Produtividade
            {
                "name": "mcp-server-notion",
                "display_name": "Notion",
                "category": "📅 Produtividade",
                "description": "Integração para gestão de páginas e bancos de dados no Notion.",
                "runtime": "node",
                "command": "npx -y @modelcontextprotocol/server-notion",
                "config_schema": {
                    "required": ["NOTION_API_KEY"],
                    "properties": {
                        "NOTION_API_KEY": {"type": "string", "title": "Internal Integration Token"}
                    }
                },
                "metadata_json": {"cost": "Free"}
            },
            {
                "name": "mcp-server-google-calendar",
                "display_name": "Google Calendar",
                "category": "📅 Produtividade",
                "description": "Gestão de eventos e compromissos na agenda do Google.",
                "runtime": "node",
                "command": "npx -y @modelcontextprotocol/server-google-calendar",
                "config_schema": {
                    "required": ["GOOGLE_CALENDAR_CREDENTIALS"],
                    "properties": {
                        "GOOGLE_CALENDAR_CREDENTIALS": {"type": "string", "title": "Credentials JSON", "format": "textarea"}
                    }
                },
                "metadata_json": {"cost": "Free"}
            },
            # 🤖 IA e Mídia
            {
                "name": "dalle-mcp",
                "display_name": "DALL-E (Geração)",
                "category": "🤖 IA e Mídia",
                "description": "Geração de imagens de alta qualidade via IAs Generativas.",
                "runtime": "python",
                "command": "uv run dalle-mcp-server",
                "config_schema": {
                    "required": ["OPENAI_API_KEY"],
                    "properties": {
                        "OPENAI_API_KEY": {"type": "string", "title": "OpenAI API Key"}
                    }
                },
                "metadata_json": {"cost": "Paid (API)"}
            },
            {
                "name": "whisper-mcp",
                "display_name": "Whisper (Transcrição)",
                "category": "🤖 IA e Mídia",
                "description": "Transcrição de áudio e vídeo com precisão profissional.",
                "runtime": "python",
                "command": "uv run whisper-mcp-server",
                "config_schema": {
                    "required": ["OPENAI_API_KEY"],
                    "properties": {
                        "OPENAI_API_KEY": {"type": "string", "title": "OpenAI API Key"}
                    }
                },
                "metadata_json": {"cost": "Paid (API)"}
            },
            # 📊 BI & Automação
            {
                "name": "mcp-server-google-sheets",
                "display_name": "Google Sheets",
                "category": "📊 BI & Automação",
                "description": "Leitura e escrita direta em planilhas do Google Sheets.",
                "runtime": "node",
                "command": "npx -y @modelcontextprotocol/server-google-sheets",
                "config_schema": {
                    "required": ["GOOGLE_CREDENTIALS_JSON"],
                    "properties": {
                        "GOOGLE_CREDENTIALS_JSON": {"type": "string", "title": "Conteúdo do arquivo JSON de credenciais", "format": "textarea"}
                    }
                },
                "metadata_json": {"cost": "Free"}
            },
            # 🛠️ Dev & Ops
            {
                "name": "mcp-server-github",
                "display_name": "GitHub",
                "category": "🛠️ Dev & Ops",
                "description": "Gestão de issues, PRs e leitura de código em repositórios GitHub.",
                "runtime": "node",
                "command": "npx -y @modelcontextprotocol/server-github",
                "config_schema": {
                    "required": ["GITHUB_PERSONAL_ACCESS_TOKEN"],
                    "properties": {
                        "GITHUB_PERSONAL_ACCESS_TOKEN": {"type": "string", "title": "Personal Access Token (PAT)"}
                    }
                },
                "metadata_json": {"cost": "Free"}
            },
            {
                "name": "mcp-server-gmail",
                "display_name": "Gmail (Google Mail)",
                "category": "💬 Comunicação",
                "description": "Busca, leitura e envio de e-mails via conta Google.",
                "runtime": "node",
                "command": "npx -y @modelcontextprotocol/server-google-mail",
                "config_schema": {
                    "required": ["GOOGLE_CREDENTIALS_JSON"],
                    "properties": {
                        "GOOGLE_CREDENTIALS_JSON": {"type": "string", "title": "Credenciais JSON do Google App", "format": "textarea"}
                    }
                },
                "metadata_json": {"cost": "Free"}
            },
            # 💰 Fintech & Market
            {
                "name": "binance-mcp",
                "display_name": "Binance",
                "category": "💰 Fintech & Market",
                "description": "Consulta de preços, saldos e execução de ordens na Binance.",
                "runtime": "python",
                "command": "uv run binance-mcp-server",
                "config_schema": {
                    "required": ["BINANCE_API_KEY", "BINANCE_API_SECRET"],
                    "properties": {
                        "BINANCE_API_KEY": {"type": "string", "title": "API Key"},
                        "BINANCE_API_SECRET": {"type": "string", "title": "API Secret"}
                    }
                },
                "metadata_json": {"cost": "Free"}
            }
        ]
        
        for tool_data in initial_tools:
            existing = self.db.query(MCPTool).filter(MCPTool.name == tool_data["name"]).first()
            if not existing:
                new_tool = MCPTool(**tool_data)
                self.db.add(new_tool)
                logger.info(f"Ferramenta registrada: {tool_data['display_name']}")
        
        self.db.commit()
