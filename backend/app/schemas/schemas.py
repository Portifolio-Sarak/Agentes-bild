from pydantic import BaseModel, HttpUrl, Field
from typing import List, Optional
from uuid import UUID
from datetime import datetime


class SubtitleSegment(BaseModel):
    start: float
    duration: float
    text: str


class TranslationSegment(BaseModel):
    start: float
    duration: float
    original: str
    translated: str


class VideoProcessRequest(BaseModel):
    youtube_url: HttpUrl
    source_language: str = Field(..., min_length=2, max_length=10)
    target_language: str = Field(..., min_length=2, max_length=10)
    gemini_api_key: Optional[str] = Field(default=None, description="Chave de API do Gemini (opcional, só usada como fallback)")
    force_retranslate: bool = Field(default=False, description="Força retradução mesmo se já existir tradução")


class VideoProcessResponse(BaseModel):
    job_id: UUID
    status: str
    message: str


class JobStatusResponse(BaseModel):
    job_id: UUID
    status: str
    progress: int
    message: Optional[str] = None
    video_id: Optional[UUID] = None
    error: Optional[str] = None
    translation_service: Optional[str] = None  # Serviço de tradução sendo usado


class SubtitlesResponse(BaseModel):
    video_id: UUID
    source_language: str
    target_language: str
    segments: List[TranslationSegment]


class VideoCheckResponse(BaseModel):
    exists: bool
    translation_id: Optional[UUID] = None
    video_id: Optional[UUID] = None


# ============================================
# AUTENTICAÇÃO
# ============================================

class UserRegister(BaseModel):
    email: str = Field(..., min_length=3, max_length=255)
    username: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=1, max_length=255)


class UserLogin(BaseModel):
    email: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=1, max_length=255)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: UUID
    username: str


class ModelPreferencesUpdate(BaseModel):
    usage_mode: Optional[str] = Field(None, pattern="^(free|paid)$")
    global_strategy: Optional[str] = Field(None, pattern="^(performance|cost_benefit|speed|cheapest|free)$")
    # ... (outros campos mantidos se forem genéricos, ou removidos se específicos)
    # Para simplificar, vou manter o ModelPreferencesUpdate como está por enquanto, pois são preferencias de modelo
    model_list_limit: Optional[int] = Field(None, ge=1, le=100)


class UserProfileResponse(BaseModel):
    id: UUID
    email: str
    username: str
    created_at: datetime


# ============================================
# CHAT
# ============================================

class ChatMessageCreate(BaseModel):
    content: str = Field(..., min_length=1)
    content_type: str = Field(default="text", pattern="^(text|audio)$")
    audio_url: Optional[str] = None
    transcription: Optional[str] = None


class ChatMessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    content_type: str
    audio_url: Optional[str] = None
    transcription: Optional[str] = None
    grammar_errors: Optional[List[dict]] = None
    vocabulary_suggestions: Optional[List[dict]] = None
    difficulty_score: Optional[float] = None
    topics: Optional[List[str]] = None
    analysis_metadata: Optional[dict] = None
    feedback_type: Optional[str] = None
    created_at: datetime


class ChatSessionCreate(BaseModel):
    mode: str = Field(default="writing", pattern="^(writing|conversation)$")
    language: str = Field(..., min_length=2, max_length=10)
    preferred_service: Optional[str] = None
    preferred_model: Optional[str] = None


class ChatSessionResponse(BaseModel):
    id: UUID
    mode: str
    language: str
    model_service: Optional[str] = None
    model_name: Optional[str] = None
    is_active: bool
    message_count: int
    session_context: Optional[dict] = None
    teaching_language: Optional[str] = None
    custom_prompt: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


class ChatSessionWithMessages(ChatSessionResponse):
    messages: List[ChatMessageResponse] = []


class UpdateSessionConfigRequest(BaseModel):
    teaching_language: Optional[str] = Field(None, min_length=2, max_length=10)
    custom_prompt: Optional[str] = None