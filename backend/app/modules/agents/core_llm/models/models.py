from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, UniqueConstraint, Text, Boolean, Float, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.database import Base

from app.models.database import ApiKey, TokenUsage

class ModelCatalog(Base):
    __tablename__ = "model_catalog"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    canonical_name = Column(JSONB, nullable=False, server_default='[]')
    display_name = Column(String(200), nullable=False)
    elo_rating = Column(Float, nullable=True, index=True)
    elo_confidence_interval_lower = Column(Float, nullable=True)
    elo_confidence_interval_upper = Column(Float, nullable=True)
    performance_score = Column(Float, nullable=True, index=True)
    win_rate = Column(Float, nullable=True)
    total_votes = Column(Integer, nullable=True, default=0)
    category = Column(String(50), nullable=True, index=True)
    license_type = Column(String(50), nullable=True, index=True)
    organization = Column(String(100), nullable=True)
    aliases = Column(JSONB, nullable=False, server_default='[]')
    capabilities = Column(JSONB, nullable=False, server_default='["text_input"]')  # text_input, image_input, audio_input, etc.
    source = Column(String(50), nullable=False, default="chatbot_arena")
    last_updated = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    provider_mappings = relationship("ModelProviderMapping", back_populates="model", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index('idx_license_elo', 'license_type', 'elo_rating'),
    )

class ModelProviderMapping(Base):
    __tablename__ = "model_provider_mapping"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    model_id = Column(UUID(as_uuid=True), ForeignKey("model_catalog.id", ondelete="CASCADE"), nullable=False, index=True)
    provider = Column(String(50), nullable=False, index=True)
    provider_model_id = Column(String(200), nullable=False)
    pricing_info = Column(JSONB, nullable=True)
    is_available = Column(Boolean, default=True, nullable=False)
    last_verified = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    model = relationship("ModelCatalog", back_populates="provider_mappings")
    
    __table_args__ = (
        UniqueConstraint('provider', 'provider_model_id', name='unique_provider_model'),
        Index('idx_provider_available', 'provider', 'is_available'),
    )
