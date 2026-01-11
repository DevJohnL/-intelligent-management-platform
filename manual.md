Plataforma Inteligente de Gestão Comercial
1. Visão Geral do Produto
O SmartMart Analytics é uma solução Fullstack desenvolvida para transformar dados brutos de transações varejistas em insights acionáveis. A aplicação resolve o problema de fragmentação de dados da SmartMart Solutions, unificando cadastro de produtos, processamento em lote (CSV) e visualização de métricas financeiras em um dashboard interativo.

O diferencial do projeto é sua arquitetura orientada a dados, garantindo performance na ingestão de arquivos e uma interface moderna que auxilia na tomada de decisão estratégica.

2. Arquitetura Técnica (Tech Stack)
A escolha das tecnologias priorizou performance, tipagem estática e escalabilidade, alinhando-se às melhores práticas de mercado:

Backend (API & Processamento de Dados)
Linguagem: Python 3.11+

Framework: FastAPI (pela alta performance assíncrona e documentação automática Swagger/OpenAPI).

Data Processing: Pandas (para leitura otimizada e validação de arquivos CSV grandes e cálculos de agregações para o dashboard).

Banco de Dados: SQLite (integrado via SQLAlchemy ORM para portabilidade imediata do teste, fácil migração para PostgreSQL).

Validação: Pydantic (garantindo integridade dos dados na entrada da API).

Frontend (Interface & Visualização)
Core: React + Vite + TypeScript (para segurança de tipos e build ultra-rápido).

Estilização: Tailwind CSS (produtividade) + Shadcn/UI (componentes acessíveis e estéticos, seguindo o requisito de design system).

Gerenciamento de Estado: React Query (TanStack Query) para cache e sincronização de dados com o servidor.

Visualização de Dados: Recharts (gráficos responsivos e customizáveis).

3. Funcionalidades Detalhadas
📊 A. Dashboard Executivo (Home)
Painel central para análise rápida de saúde do negócio.

Gráfico de Tendência de Vendas: Gráfico de Linha/Área mostrando a evolução do volume de vendas mês a mês.

Gráfico de Lucratividade: Gráfico de Barras comparando Custo vs. Faturamento para identificar margem real.

Cards de KPIs: Total de Vendas (YTD), Ticket Médio e Produto Mais Vendido.

Filtro Inteligente: Dropdown para filtrar os gráficos por Categoria (ex: "Apenas Eletrônicos").

📦 B. Gestão de Produtos (CRUD Avançado)
Listagem Tabular: Tabela interativa (Shadcn Table) com paginação.

Edição Inline: Possibilidade de ajustar preços ou estoque diretamente na linha da tabela ou via Modal de Edição, sem recarregar a página.

Cadastro Manual: Formulário com validação de campos (preço não negativo, campos obrigatórios).

📂 C. Ingestão de Dados (Data Pipeline)
Upload de CSV: Endpoint dedicado que recebe arquivos products.csv ou sales.csv.

Processamento Assíncrono: O backend lê o CSV com Pandas, valida a consistência (ex: se a categoria existe) e insere em lote (bulk insert) no banco de dados, evitando timeout em grandes volumes.

🧠 D. Diferencial: "Smart Insights" (IA Simbólica)
Implementação de um componente de feedback inteligente que "fala" com o usuário baseando-se em regras de negócio (inspirado em agentes cognitivos).

Exemplo: Se o lucro de uma categoria cair 20%, o sistema exibe um alerta: "Notei que a margem de 'Eletrodomésticos' caiu este mês. Sugiro revisar o preço de custo."

4. Estrutura de Dados (Database Schema)
O banco de dados foi modelado para garantir integridade referencial:

categories

id (PK), name (Unique), discount_percent (Feature Extra: permite aplicar descontos em massa).

products

id (PK), name, price, cost_price (para cálculo de lucro), category_id (FK).

sales

id (PK), product_id (FK), quantity, total_price (snapshot do preço no momento da venda), date.


## 🏗️ Arquitetura e Padrões de Design

Este projeto não foca apenas no funcionamento, mas na **manutenibilidade** e **escalabilidade** do código. A arquitetura foi desenhada seguindo princípios de **Clean Code** e uma adaptação moderna do padrão **MVC (Model-View-Controller)** para aplicações Fullstack.

### 🧩 Padrão MVC (Adaptado para API REST)
A separação de responsabilidades foi estruturada da seguinte forma:

1.  **Model (Camada de Dados e Validação):**
    * Implementado no Backend com **SQLAlchemy** (ORM) para mapeamento do banco de dados e **Pydantic** para validação estrita de dados (Schemas).
    * *Benefício:* Garante que nenhum dado sujo ou inconsistente entre na lógica de negócios.

2.  **View (Camada de Apresentação):**
    * Totalmente desacoplada no Frontend com **React**.
    * Responsável apenas por renderizar a interface e reagir às ações do usuário. A lógica pesada de processamento de dados (como o parsing do CSV) permanece no servidor.

3.  **Controller (Camada de Controle e Serviços):**
    * Os *Routers* do FastAPI atuam como controllers, recebendo as requisições HTTP e decidindo quem deve processá-las.
    * A lógica de negócios complexa (ex: ingestão de arquivos CSV e cálculo de métricas) foi isolada em uma **Camada de Serviço (Service Layer)**, mantendo os controllers "magros" (*Skinny Controllers*).

### 🧹 Clean Code e SOLID
A escrita do código seguiu rigorosamente práticas de limpeza para facilitar a leitura por outros desenvolvedores:

* **Single Responsibility Principle (SRP):** Cada função e componente tem apenas uma responsabilidade única. Por exemplo, o componente de Gráfico não faz chamadas de API; ele apenas recebe dados e renderiza.
* **Type Hinting Robusto:** Uso intensivo de tipagem estática no Python e TypeScript no React para prevenir erros em tempo de desenvolvimento.
* **Nomes Semânticos:** Variáveis e funções descrevem exatamente o que fazem (ex: `calculate_monthly_profit` ao invés de `calc_data`), eliminando a necessidade de comentários excessivos.
* **Tratamento de Erros:** O backend devolve mensagens de erro claras e códigos HTTP adequados (400, 404, 500) em vez de falhar silenciosamente.