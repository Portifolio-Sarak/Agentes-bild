# Sarak - Plataforma de Agentes Especialistas

O Sarak é um ecossistema de Inteligência Artificial focado em continuidade cognitiva, consistência de personalidade e democratização da automação. O sistema utiliza tecnologias de ponta como RAG, bancos de dados vetoriais e protocolos de interoperabilidade para oferecer uma experiência de IA robusta e acessível.

---

## 🏗️ Funcionalidades Principais

### 1. Agentes Especialistas com Memória de Longo Prazo
Módulo desenvolvido para solucionar os desafios críticos de "amnésia" de contexto e diluição de identidade em conversas extensas:
- **Persistência via RAG (Retrieval-Augmented Generation):** Utiliza o banco vetorial **ChromaDB** para implementar uma memória semântica baseada em embeddings, permitindo a recuperação de informações históricas por similaridade.
- **Preservação de Identidade:** Mecanismo de re-injeção de diretrizes (*System Prompts*) que garante uma persona consistente independentemente da duração da sessão.

### 2. Dashboard LLM: Inteligência e Roteamento
Centro de orquestração que automatiza a curadoria e o consumo de IA:
- **Catálogo Dinâmico:** Ingestão automática de modelos via **OpenRouter API**, capturando metadados como janelas de contexto e precificação.
- **Seleção por Performance (Elo Rating):** Integração com o **Chatbot Arena (LMSYS)** para classificar modelos por excelência técnica comprovada.
- **Roteamento Inteligente:** Seleção automática da API mais eficiente baseada em critérios de latência, custo e qualidade para cada tarefa específica.

### 3. Democracia Digital: Criação Conversacional (Zero Code)
Foco total na acessibilidade para usuários sem experiência técnica:
- **Arquiteto de IA:** Um chat de auxílio que traduz intenções em linguagem natural para arquiteturas funcionais de **Agentes** e **Workflows**.
- **Automação por Intenção:** O usuário define o objetivo final e o sistema orquestra a conexão entre especialistas e ferramentas (via protocolo **MCP**) sem exigir uma única linha de código.

---

## 🚀 Como instalar em um novo computador

### 1. Pré-requisitos
- **Python 3.10+**
- **Node.js 18+**
- **PostgreSQL** instalado e operacional.

### 2. Configuração do Banco de Dados
1. Crie um banco de dados no PostgreSQL chamado `Agente_traducao`.
2. Certifique-se de que o serviço do PostgreSQL está ativo.

### 3. Configuração do Backend
1. Entre na pasta `backend`:
   ```bash
   cd backend
   ```
2. Crie e ative um ambiente virtual:
   ```bash
   python -m venv .venv
   # No Windows:
   .\.venv\Scripts\activate
   # No Linux/Mac:
   source .venv/bin/activate
   ```
3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure o arquivo `.env`:
   - Copie o `env.example` da raiz para a pasta `backend/` e renomeie-o para `.env`.
   - Ajuste as credenciais do banco de dados em `DATABASE_URL`.
5. Inicialize as tabelas do banco:
   ```bash
   python init_db.py
   ```

### 4. Configuração do Frontend
1. Na raiz do projeto ou na pasta `frontend`, instale as dependências:
   ```bash
   npm install
   ```

## 🛠️ Como executar o projeto

### Executar Backend
```bash
cd backend
.\.venv\Scripts\activate
python -m uvicorn app.main:app --reload
```

### Executar Frontend
```bash
npm run dev
```

---

