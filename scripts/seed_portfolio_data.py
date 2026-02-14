import sys
import os
import random
from datetime import datetime, timedelta
import uuid
import json

# Adiciona o diretório raiz ao path para importar os módulos da aplicação
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.database import Base, User, TokenUsage, ApiKey
from app.modules.agents.factory.models.models import Agent, AgentSession, AgentChatMessage
from app.services.encryption import encryption_service

# Modelos para simulação de uso
PROVIDERS = {
    'openai': {'models': ['gpt-4o', 'gpt-3.5-turbo'], 'cost_per_1k': 0.03},
    'google': {'models': ['gemini-1.5-pro', 'gemini-1.5-flash'], 'cost_per_1k': 0.00},
    'anthropic': {'models': ['claude-3-5-sonnet', 'claude-3-opus'], 'cost_per_1k': 0.015},
    'meta': {'models': ['llama-3-70b', 'llama-3-8b'], 'cost_per_1k': 0.001}
}

AGENTS_DATA = [
    {
        "name": "Arquiteto de Software Sênior",
        "description": "Especialista em padrões de projeto, arquitetura limpa e escalabilidade.",
        "base_prompt": "Você é um Arquiteto de Software Sênior com 15 anos de experiência. Seu foco é sempre sugerir soluções escaláveis, seguras e de fácil manutenção. Você domina SOLID, Clean Architecture e Microsserviços. Seja direto, técnico e use exemplos de código quando necessário.",
        "configuration": {"temperature": 0.2, "model": "gemini-1.5-pro"}
    },
    {
        "name": "Copywriter Criativo",
        "description": "Cria textos persuasivos para marketing, vendas e redes sociais.",
        "base_prompt": "Você é um copywriter premiado, especialista em gatilhos mentais e conversão. Seu estilo é moderno, engajador e direto. Você escreve e-mails, landing pages e posts para redes sociais que prendem a atenção do leitor.",
        "configuration": {"temperature": 0.8, "model": "gpt-4o"}
    },
    {
        "name": "Tutor Poliglota",
        "description": "Ensina idiomas através de conversação natural e correções sutis.",
        "base_prompt": "Você é um professor de idiomas paciente e encorajador. Seu objetivo é conversar com o usuário na língua que ele deseja praticar. Faça correções sutis apenas quando o erro prejudicar o entendimento, e sempre elogie o progresso. Mantenha o diálogo fluido.",
        "configuration": {"temperature": 0.6, "model": "gpt-4o"}
    }
]

def seed_portfolio_data():
    db = SessionLocal()
    try:
        # 1. Obter usuário de teste
        user = db.query(User).filter(User.email == "usuario@teste.com").first()
        if not user:
            print("Usuário 'usuario@teste.com' não encontrado! Rode o seed_users.py primeiro.")
            return

        print(f"Gerando dados para: {user.username} ({user.id})")

        # 2. Limpar dados existentes desse usuário (para evitar duplicatas se rodar várias vezes)
        db.query(TokenUsage).filter(TokenUsage.user_id == user.id).delete()
        db.query(ApiKey).filter(ApiKey.user_id == user.id).delete()
        # Agentes deletam sessões/mensagens em cascata
        db.query(Agent).filter(Agent.user_id == user.id).delete() 
        db.commit()
        print("Dados antigos limpos.")

        # 3. Criar Agentes
        print("Criando Agentes...")
        for agent_data in AGENTS_DATA:
            agent = Agent(
                user_id=user.id,
                **agent_data
            )
            db.add(agent)
        db.commit()

        # 4. Criar Chaves de API (Dummy para visualização)
        print("Criando Chaves de API...")
        for service in PROVIDERS.keys():
            dummy_key = f"dummy_{service}_key_encrypted_for_demo_{uuid.uuid4()}"
            encrypted = encryption_service.encrypt(dummy_key)
            
            key = ApiKey(
                user_id=user.id,
                service=service,
                encrypted_key=encrypted
            )
            db.add(key)
        db.commit()

        # 5. Gerar Histórico de Uso (Últimos 30 dias)
        print("Gerando Histórico de Uso...")
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        current_date = start_date
        while current_date <= end_date:
            # Simular padrão semanal (menos uso no fds)
            is_weekend = current_date.weekday() >= 5
            daily_volume = random.randint(10, 50) if is_weekend else random.randint(50, 200)

            for _ in range(daily_volume):
                # Escolher provedor e modelo aleatoriamente com pesos
                provider_name = random.choices(list(PROVIDERS.keys()), weights=[0.4, 0.3, 0.2, 0.1])[0]
                provider_data = PROVIDERS[provider_name]
                model = random.choice(provider_data['models'])
                
                # Tokens aleatórios
                inp = random.randint(50, 1500)
                out = random.randint(20, 800)
                total = inp + out

                usage = TokenUsage(
                    user_id=user.id,
                    service=provider_name,
                    model=model,
                    input_tokens=inp,
                    output_tokens=out,
                    total_tokens=total,
                    requests=1,
                    created_at=current_date + timedelta(hours=random.randint(8, 22), minutes=random.randint(0, 59))
                )
                db.add(usage)
            
            current_date += timedelta(days=1)
            # Commit a cada dia para não estourar memória se fosse muito dado
        
        db.commit()
        print("Dados de portfólio criados com sucesso!")

    except Exception as e:
        print(f"Erro ao criar dados: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_portfolio_data()
