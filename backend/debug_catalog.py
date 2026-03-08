import sys
import os

# Adiciona o diretório atual ao path
sys.path.append(os.getcwd())

from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.modules.agents.core_llm.services.catalog.catalog_service import ModelCatalogService

def run_diagnostic():
    db = SessionLocal()
    try:
        service = ModelCatalogService()
        print("Iniciando sincronização manual do catálogo...")
        stats = service.sync_catalog(db)
        print(f"Sincronização concluída: {stats}")
        
        from app.modules.agents.core_llm.models.models import ModelCatalog
        count = db.query(ModelCatalog).count()
        print(f"Total de modelos no banco: {count}")
        
    except Exception as e:
        print(f"Erro no diagnóstico: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    run_diagnostic()
