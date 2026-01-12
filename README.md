# SmartMart Analytics Platform

SmartMart Analytics é uma plataforma fullstack projetada para transformar dados de vendas, produtos e categorias em insights operacionais imediatos. Ela combina uma API FastAPI com um painel React/Vite que consome métricas de dashboard, gráficos de tendência e formulários de ingestão de dados (CSV ou CRUD).

## Estrutura do repositório

- `/backend`: API FastAPI responsável por persistência SQLite, ingestão via Pandas e painel de dashboards.
- `/frontend`: SPA React + Vite + TypeScript que consome os endpoints da API e entrega gráficos, cards e formulários.
- `/categories.csv`, `/products.csv`, `/sales.csv`: exemplos de dados que podem ser enviados pela API de ingestão.
- `/public/examples`: mesmos CSVs usados no frontend para permitir upload rápido durante testes.

## Pré-requisitos

- Python **3.11+** e `pip`
- Node.js **18+** (recomendado LTS) e `npm`
- `curl` ou qualquer cliente HTTP para testes manuais
- (opcional) `direnv`/`autoenv` para automatizar variáveis de ambiente

## Backend (FastAPI)

### 1. Configurar o ambiente

```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate   # Windows
# source venv/Scripts/activate # macOS/Linux
pip install -r requirements.txt
```

> O arquivo `backend/smartmart.db` já existe e será utilizado por padrão. As tabelas são criadas automaticamente no evento `startup`.

### 2. Variáveis e configurações

- As configurações carregam de `backend/app/core/config.py`, que referencia `smartmart.db`.
- Caso queira usar outro caminho, defina `DATABASE_URL` num `.env` na raiz de `backend`:
  ```
  DATABASE_URL=sqlite:///caminho/para/outro.db
  ```
- O backend também aceita arquivos `categories`, `products` e `sales` via `/ingest/csv/{entidade}`.

### 3. Executar localmente

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- A API ficará disponível em `http://127.0.0.1:8000`.
- A documentação automática pode ser acessada em `/docs` (Swagger) e `/redoc`.

### 4. Rotas principais

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET /` | `/` | Verifica saúde da API e retorna mensagem de boas-vindas. |
| `GET /docs` | `/docs` | UI Swagger com todos os endpoints. |
| `GET /redoc` | `/redoc` | Documentação alternativa. |
| `POST /categories` | `/categories` | Cria categoria (nome único + desconto). |
| `GET /categories` | `/categories` | Lista todas as categorias. |
| `POST /products` | `/products` | Cadastro de produto (verifica categoria). |
| `GET /products` | `/products` | Lista de produtos com relação de categoria. |
| `PATCH/DELETE /products/{id}` | `/products/{id}` | Atualiza ou remove produto. |
| `POST /sales` | `/sales` | Registra venda (validando produto). |
| `GET /sales` | `/sales` | Histórico de vendas ordenado por data. |
| `GET /sales/quantity` | `/sales/quantity` | Quantidades vendidas por produto (opcional `product_id`). |
| `GET /sales/quantity-trend` | `/sales/quantity-trend` | Evolução mensal por produto. |
| `POST /ingest/csv/{entity}` | `/ingest/csv/categories|products|sales` | Ingestão rápida de CSV. |
| `GET /dashboard/metrics` | `/dashboard/metrics` | Métricas agregadas (total vendas, ticket, alerta de margem). |

### 5. Ingestão de CSV

- Envie os exemplos `categories.csv`, `products.csv` ou `sales.csv` (ou seus próprios) com `multipart/form-data`.
- Exemplo (Windows PowerShell):

```powershell
curl -X POST "http://127.0.0.1:8000/ingest/csv/products" `
  -F "file=@..\products.csv"
```

- O backend atualiza categorias existentes, substitui preços/custos dos produtos e registra novas vendas. O retorno informa os registros processados e uma mensagem de insight.

### 6. Testes manuais

- Verifique o status inicial: `curl http://127.0.0.1:8000/`.
- Certifique-se de acessar `/dashboard/metrics` com `curl` ou uma ferramenta como Postman.
- Você pode rodar `uvicorn` com `--reload` para observar hot reload durante o desenvolvimento.

## Frontend (React + Vite)

### 1. Instalar dependências

```powershell
cd frontend
npm install
```

### 2. Configurar a URL da API

- Por padrão, `frontend/src/services/api.ts` usa `http://127.0.0.1:8000`. Para sobrescrever:

```powershell
echo "VITE_API_BASE_URL=http://localhost:8000" > .env
```

- Atualize o valor caso rode o backend em outra porta/host.

### 3. Executar o ambiente de desenvolvimento

```powershell
npm run dev
```

- O Vite inicializa em `http://localhost:5173`.
- O dashboard consome `react-query` para métricas, listas de vendas/produtos e formulários conectados aos endpoints criados no backend.

### 4. Testar/build

```powershell
npm run build
npm run preview  # opcional para simular produção
```

- `npm run build` roda o TypeScript (`tsc`) + build do Vite e valida se o frontend compila sem erros.
- `npm run preview` serve o build estático para validação final.

### 5. Validação funcional

- Use o dashboard para visualizar:
  - Cards de KPIs (`Monetário`, `Ticket médio`, `Produto em destaque`).
  - Gráficos de tendência (`ProductMonthlySalesTrendChart`, `SalesTrendChart`).
  - Gráfico de pizza (`ProductSalesPieChart`) e formulários de cadastro/ingestão.
- Os hooks em `src/hooks` usam `react-query` para manter os dados sincronizados com a API.

## Fluxo típico para testes locais

1. Inicie o backend (`uvicorn app.main:app --reload --port 8000`).
2. Inicie o frontend (`npm run dev`) em outra aba/terminal.
3. Use o botão de upload ou `curl` para injetar os CSVs de exemplo.
4. Acesse `http://localhost:5173` para ver o dashboard reagindo aos dados.

## Observações adicionais

- O backend já injeta os bancos em `backend/smartmart.db`, mas você pode remover o arquivo e deixar o FastAPI recriar as tabelas limpando os dados.
- Favor ativar o virtual environment antes de instalar/rodar comandos Python para evitar conflitos com o Python global.
- O frontend utiliza Tailwind CSS configurado em `tailwind.config.js` e `src/style.css`; adapte os tokens conforme a identidade visual desejada.

Para dúvidas específicas sobre rotas ou payloads, explore os schemas em `backend/app/schemas.py` ou abra `/docs` após iniciar o backend.

