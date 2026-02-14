import axios from 'axios';

// Em alguns ambientes Windows, `localhost` pode resolver primeiro para IPv6 (::1),
// enquanto o backend do Uvicorn está ouvindo apenas em 127.0.0.1. Isso causa erro
// de rede no login (sem response). Usamos 127.0.0.1 como fallback seguro.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT automaticamente
api.interceptors.request.use((config) => {
  // Verifica tanto localStorage quanto sessionStorage
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado - limpa ambos storages
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('username');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user_id');
      sessionStorage.removeItem('username');
      // Não redireciona automaticamente - deixa o ProtectedRoute gerenciar
    }
    return Promise.reject(error);
  }
);

// Video and Practice APIs removed as part of cleanup

export interface ApiKeyStatus {
  service: string;
  is_valid: boolean;
  models_status: Array<{
    name: string;
    available: boolean;
    blocked: boolean;
    status: string;
    category?: string; // text, reasoning, audio, video, code, multimodal
    tier?: string; // "free", "paid", "unknown"
    tier_reason?: string; // Motivo curto quando tier="unknown"
    quota_used?: number; // Tokens usados (free)
    quota_limit?: number; // Limite tokens (free)
    cost_last_24h?: number; // Custo $ (paid)
  }>;
  available_models: string[];
  blocked_models: string[];
  error: string | null;
  models_by_category?: {
    [category: string]: Array<{
      name: string;
      available: boolean;
      blocked: boolean;
      status: string;
      category?: string;
      tier?: string;
      tier_reason?: string;
      quota_used?: number;
      quota_limit?: number;
      cost_last_24h?: number;
    }>;
  };
  credits?: string | number | null;
}

export interface ApiKeyResponse {
  id: string;
  service: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiKeyCreate {
  service: string;
  api_key: string;
}

export const apiKeysApi = {
  checkStatus: async (api_key: string, service: string = 'gemini'): Promise<ApiKeyStatus> => {
    const response = await api.post<ApiKeyStatus>('/api/keys/check-status', {
      api_key,
      service,
    });
    return response.data;
  },

  list: async (): Promise<{ api_keys: ApiKeyResponse[]; total: number }> => {
    const response = await api.get('/api/keys/list');
    return response.data;
  },

  create: async (keyData: ApiKeyCreate): Promise<ApiKeyResponse> => {
    const response = await api.post<ApiKeyResponse>('/api/keys/', keyData);
    return response.data;
  },

  delete: async (keyId: string): Promise<void> => {
    await api.delete(`/api/keys/${keyId}`);
  },

  deleteByService: async (service: string): Promise<void> => {
    await api.delete(`/api/keys/service/${service}`);
  },

  checkSavedStatus: async (service: string): Promise<ApiKeyStatus> => {
    const response = await api.post<ApiKeyStatus>(`/api/keys/check/${service}/saved`);
    return response.data;
  },
};

export interface UsageStats {
  service?: string;
  total_tokens: number;
  input_tokens: number;
  output_tokens: number;
  requests: number;
  models: Array<{
    model: string;
    tokens: number;
    input_tokens: number;
    output_tokens: number;
    requests: number;
  }>;
  daily_usage: Array<{
    date: string;
    total_tokens: number;
    requests: number;
  }>;
  period_days: number;
}

export interface UsageStatsResponse {
  services?: UsageStats[];
  service?: string;
  total_tokens: number;
  input_tokens: number;
  output_tokens: number;
  requests: number;
  models: Array<{
    model: string;
    tokens: number;
    input_tokens: number;
    output_tokens: number;
    requests: number;
  }>;
  daily_usage: Array<{
    date: string;
    total_tokens: number;
    requests: number;
  }>;
  period_days: number;
}

export const usageApi = {
  getStats: async (service?: string, days: number = 30): Promise<UsageStatsResponse> => {
    const params: any = { days };
    if (service) {
      params.service = service;
    }
    const response = await api.get<UsageStatsResponse>('/api/usage/stats', { params });
    return response.data;
  },
};

// ============================================
// AUTENTICAÇÃO
// ============================================

export interface RegisterRequest {
  email: string;
  username: string;
  password?: string;
  native_language?: string;
  learning_language?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  username: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  native_language: string;
  learning_language: string;
  proficiency_level: string;
  total_chat_messages: number;
  total_practice_sessions: number;
  average_response_time: number;
  learning_context?: any;
  preferred_learning_style?: string;
  preferred_model?: string;
  created_at: string;
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/api/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/api/auth/login', data);
    return response.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/api/auth/me');
    return response.data;
  },
};

// ============================================
// CHAT
// ============================================

// Chat API removed as part of cleanup

export interface CatalogStatusResponse {
  is_populated: boolean;
  total_models: number;
  last_updated: string | null;
  source: string | null;
  api_available: boolean;
  api_error: string | null;
  using_mock_data: boolean;
}

export const modelCatalogApi = {
  getStatus: async (): Promise<CatalogStatusResponse> => {
    const response = await api.get<CatalogStatusResponse>('/api/model-catalog/status');
    return response.data;
  },

  sync: async (): Promise<{ success: boolean; stats: any; message: string }> => {
    const response = await api.post<{ success: boolean; stats: any; message: string }>('/api/model-catalog/sync');
    return response.data;
  },
};

export default api;
