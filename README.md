Sistema de Vistorias - Frontend

Aplicação web para gestão de vistorias veiculares, desenvolvida com Next.js, React, TypeScript e TailwindCSS.

🚀 Funcionalidades

Autenticação JWT com refresh token

Gestão de vistorias (criação, edição e visualização)

Checklist interativo por item

CRUD de veículos

Relatórios e métricas

Interface responsiva

🛠️ Tecnologias

Next.js 15 (App Router)

React 19

TypeScript

TailwindCSS

Axios

📦 Instalação e Uso

Clone o repositório:

git clone <repository-url>
cd project-vistorias-web

Instale as dependências:

npm install

Configure o arquivo .env.local:

NEXT_PUBLIC_API_URL=http://localhost:8000

Execute o projeto:

npm run dev

Acesse em http://localhost:3000.

📡 Integração com API

Principais endpoints utilizados:

POST /auth/login – Login

POST /auth/register – Registro

POST /auth/refresh – Renovação de token

GET /vehicles – Listagem de veículos

GET /inspections – Listagem de vistorias

GET /reports/overview – Relatório geral

🚀 Deploy

Vercel (recomendado) – Deploy automático a cada push

Ou manualmente:

npm run build
npm start
