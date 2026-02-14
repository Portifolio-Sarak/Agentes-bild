from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.services.logging_config import setup_logging

# Configura logging primeiro
setup_logging("INFO")
logger = logging.getLogger(__name__)

# Importa modelos para garantir que sejam registrados no Base.metadata
from app.models.database import ApiKey, TokenUsage, User
from app.modules.agents.core_llm.models.models import ModelCatalog, ModelProviderMapping
from app.modules.agents.factory.models.models import Agent, AgentSession, AgentChatMessage, AgentDocument
from app.modules.agents.mcp.models.models import MCPTool, AgentToolLink

# Importa rotas básicas e de domínio
from app.api.routes import auth
# Importa rotas modulares do core_llm
from app.modules.agents.core_llm.api import model_catalog_router, usage_router, api_keys_router
from app.modules.agents.factory.api.routes import router as agents_router
from app.modules.agents.mcp.api.routes import router as mcp_router

Base.metadata.create_all(bind=engine)


import asyncio

async def periodic_catalog_sync():
    """Tarefa de fundo para manter o catálogo atualizado periodicamente usando o novo módulo core_llm"""
    # Aguarda um tempo maior para o servidor subir completamente antes de iniciar carga pesada
    await asyncio.sleep(15)
    
    while True:
        logger.info("Iniciando ciclo de sincronização do catálogo de modelos (Modular core_llm)...")
        try:
            # Executa a sincronização pesada em uma thread separada para não bloquear o loop principal
            loop = asyncio.get_running_loop()
            await loop.run_in_executor(None, _run_sync_catalog)
        except Exception as e:
            logger.error(f"Erro ao agendar sincronização modular: {e}")
            
        await asyncio.sleep(10800) # 3 horas

def _run_sync_catalog():
    """Função wrapper síncrona para ser rodada no executor"""
    try:
        db = SessionLocal()
        try:
            from app.modules.agents.core_llm.services.catalog.catalog_service import ModelCatalogService
            catalog_service = ModelCatalogService()
            stats = catalog_service.sync_catalog(db)
            db.commit()
            logger.info(f"Sincronização modular concluída: {stats.get('created', 0)} novos, {stats.get('updated', 0)} atualizados.")
        except Exception as e:
            logger.error(f"Erro durante a sincronização modular periódica: {e}")
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Erro ao abrir conexão para sincronização modular: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gerencia o ciclo de vida da aplicação"""
    # Ativa sincronização em background
    asyncio.create_task(periodic_catalog_sync())
    logger.info("Tarefa de sincronização periódica do core_llm registrada.")
    yield
    logger.info("Encerrando aplicação...")

app = FastAPI(
    title="Sarak Agents API",
    description="API para gestão e execução de agentes inteligentes",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas
app.include_router(auth.router)

# Rotas Modulares do core_llm
app.include_router(api_keys_router)
app.include_router(usage_router)
app.include_router(model_catalog_router)
app.include_router(agents_router)
app.include_router(mcp_router)


@app.get("/")
async def root():
    return {"message": "Sarak Agents API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
