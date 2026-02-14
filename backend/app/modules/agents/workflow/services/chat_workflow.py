"""
Workflow de Orquestração de Chat
Gerencia: Geração de Resposta -> Análise de Mensagem -> Persistência -> Feedback
"""
from typing import Optional, Dict, Any
from .base import BaseWorkflow, WorkflowContext
from app.modules.agents.factory.models.models import AgentSession
import logging

logger = logging.getLogger(__name__)

class ChatWorkflow(BaseWorkflow):
    """
    Orquestra o fluxo de processamento de uma mensagem de chat
    """
    def __init__(self, chat_service, analyzer, normalizer, prompt_provider):
        super().__init__()
        self.chat_service = chat_service
        self.analyzer = analyzer
        self.normalizer = normalizer
        self.prompt_provider = prompt_provider

    def execute(self, context: WorkflowContext) -> Dict[str, Any]:
        """
        Executa o fluxo completo de chat:
        1. Contexto
        2. Geração de Resposta (LLM)
        """
        session = context.get("session")
        user_message_content = context.get("content")
        
        context.log(f"Iniciando workflow de chat para sessão {session.id}")

        # 1. Geração de Resposta
        context.log("Solicitando resposta ao LLM...")
        llm_result = self._generate_llm_response(session, context)
        
        # 2. Resultado Final
        result = {
            "response_content": llm_result["content"],
            "feedback_type": llm_result.get("feedback_type", "none"),
            "session": session,
            "selected_model": llm_result.get("selected_model"),
            "notices": llm_result.get("notices", [])
        }
        
        context.log("Workflow de chat concluído")
        return result

    def _generate_llm_response(self, session, context):
        """Lógica interna de geração delegada ao router e provider com suporte a Fallback"""
        db = self.chat_service.db
        from app.modules.agents.factory.models.models import AgentChatMessage
        from app.modules.agents.core_llm.services.selector import UniversalModelSelector, SelectionRequest, ModelCapability
        from app.modules.agents.core_llm.services.orchestrator.base import InsufficientBalanceError, QuotaExceededError, LLMError

        # 1. Obter histórico para contexto
        previous_messages = db.query(ChatMessage).filter(
            ChatMessage.session_id == session.id
        ).order_by(ChatMessage.created_at).all()
        
        # 2. Seleção de Modelo Dinâmica (per-message)
        # Permite detectar se o saldo acabou DURANTE a sessão e trocar de modelo
        selector = UniversalModelSelector(db)
        from app.modules.agents.core_llm.services.selector.domain import AgentCategory
        request = SelectionRequest(
            user_id=str(session.user_id),
            function_name="chat",
            agent_category=AgentCategory.CHAT,
            required_capabilities=[ModelCapability.TEXT_INPUT]
        )
        
        selection = selector.select_model(request)
        context.set("selector_notices", selection.notices)

        # Tentativa de chamada com Retry em caso de erro de Custo/Cota
        candidates = [selection.selected_model] + selection.alternatives
        last_error = None
        
        for candidate in candidates:
            service = self.chat_service.chat_router.get_service(candidate.provider)
            if not service: continue
            
            try:
                # Constrói contexto final
                conversation_context = self._build_conversation_context(
                    session, previous_messages, context.get("content")
                )
                
                # Chamada real
                # TODO: Usar model_name correto ou deixar o service decidir
                response_text = service.generate_text(prompt=conversation_context, max_tokens=1000, model_name=candidate.model)
                
                # Se mudamos o modelo em relação ao que está na sessão (TODO: adaptar para AgentSession)
                # if session.model_name != candidate.model:
                #     session.model_service = candidate.provider
                #     session.model_name = candidate.model
                
                return {
                    "content": response_text,
                    "feedback_type": "none",
                    "selected_model": candidate.model,
                    "notices": selection.notices
                }

            except (InsufficientBalanceError, QuotaExceededError) as e:
                logger.warning(f"Falha de Custo/Cota no modelo {candidate.model}: {e}")
                # Registra no CircuitBreaker para o Seletor saber na PRÓXIMA vez
                reason = "insufficient_balance" if isinstance(e, InsufficientBalanceError) else "quota_exceeded"
                selector.availability.circuit_breaker.record_failure(str(candidate.db_model.get("id")), reason=reason)
                
                # Adiciona notice para o usuário
                msg = "Saldo insuficiente" if reason == "insufficient_balance" else "Cota atingida"
                notice = f"Aviso: {msg} no modelo {candidate.model}. Tentando alternativa..."
                if notice not in selection.notices: selection.notices.append(notice)
                last_error = e
                continue
            except Exception as e:
                logger.error(f"Erro ao gerar resposta com {candidate.model}: {e}")
                last_error = e
                continue

        # Se chegou aqui, todos os candidatos falharam
        raise Exception(f"Não foi possível obter resposta da IA após tentar alternativas. Último erro: {last_error}")

    def _build_conversation_context(self, session, previous_messages, current_content):
        """Constrói o prompt final para o LLM"""
        # system_prompt = self.prompt_provider.get_system_prompt(session) 
        # TODO: Ajustar prompt_provider
        
        base_prompt = getattr(session.agent, 'base_prompt', 'Você é um assistente útil.')
        
        context_parts = [
            f"INSTRUÇÕES DO SISTEMA:\n{base_prompt}\n",
            "---",
            "CONVERSA:\n"
        ]
        
        # Mensagens recentes (limite de 10)
        recent = previous_messages[-10:] if len(previous_messages) > 10 else previous_messages
        for msg in recent:
            role_map = {"user": "Usuário", "assistant": "Assistente", "system": "Sistema"}
            content = msg.content
            context_parts.append(f"{role_map.get(msg.role, msg.role)}: {content}")
            
        # Mensagem atual
        context_parts.append(f"Usuário: {current_content}")
        context_parts.append("Assistente:")
        
        return "\n".join(context_parts)

