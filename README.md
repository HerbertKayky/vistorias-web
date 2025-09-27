# Sistema de Vistorias - Frontend

Sistema web para gestão de vistorias veiculares desenvolvido com Next.js, React, TypeScript e TailwindCSS.

## 🚀 Funcionalidades

- **Autenticação JWT**: Login seguro com renovação automática de tokens
- **Gestão de Vistorias**: Criação, edição e visualização de inspeções veiculares
- **Checklist Interativo**: Sistema de aprovação/reprovação por item
- **Gestão de Veículos**: CRUD completo para cadastro de veículos
- **Relatórios e Gráficos**: Métricas visuais com Chart.js
- **Exportação CSV**: Download de dados em formato CSV
- **Interface Responsiva**: Design adaptável para desktop e tablet

## 🛠️ Tecnologias

- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Framework CSS utilitário
- **TanStack Query** - Gerenciamento de estado servidor
- **Axios** - Cliente HTTP
- **Chart.js** - Gráficos e visualizações
- **Lucide React** - Ícones modernos

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd project-vistorias-web
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a URL da API no arquivo `src/services/api.ts`:
```typescript
baseURL: 'http://localhost:8000', // URL do seu backend
```

4. Execute o projeto:
```bash
npm run dev
```

5. Acesse `http://localhost:3000`

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend

Este frontend foi desenvolvido para funcionar com o backend NestJS de vistorias. Certifique-se de que o backend esteja rodando na porta 8000.

## 📱 Páginas e Funcionalidades

### 🔐 Login (`/login`)
- Formulário de autenticação
- Validação de campos
- Redirecionamento automático
- Link para cadastro

### 📝 Cadastro (`/cadastro`)
- Formulário de registro de usuário
- Validação completa de dados
- Confirmação de senha
- Link para login

### 📋 Vistorias (`/vistorias`)
- Listagem paginada de inspeções
- Filtros por status, período e busca
- Cards com estatísticas resumidas
- Ações: visualizar, editar, exportar

### ➕ Nova Vistoria (`/vistorias/new`)
- Seleção de veículo
- Checklist interativo de itens
- Campo de observações
- Validação de dados

### 👁️ Detalhes da Vistoria (`/vistorias/[id]`)
- Visualização completa da inspeção
- Informações do veículo
- Status e histórico
- Ações de aprovação/reprovação

### ✏️ Editar Vistoria (`/vistorias/[id]/edit`)
- Modificação do checklist
- Atualização de observações
- Validação de alterações

### 🚗 Veículos (`/veiculos`)
- Listagem de veículos cadastrados
- Formulário de criação/edição
- Busca por placa, marca ou modelo
- Estatísticas da frota

### 📊 Relatórios (`/relatorios`)
- Métricas gerais do sistema
- Gráficos de distribuição por status
- Taxa de aprovação por inspetor
- Filtros de período
- Exportação de dados

## 🎨 Design System

### Componentes UI
- **Button**: Botões com variantes (primary, secondary, danger, outline)
- **Card**: Containers com header e conteúdo
- **Input**: Campos de entrada com validação
- **Select**: Listas suspensas
- **Textarea**: Área de texto multilinha

### Cores
- **Primary**: Azul (#3b82f6)
- **Success**: Verde (#22c55e)
- **Warning**: Amarelo (#f59e0b)
- **Danger**: Vermelho (#ef4444)

## 🔒 Autenticação

O sistema utiliza JWT com refresh tokens:
- Tokens armazenados em cookies seguros
- Renovação automática
- Redirecionamento para login em caso de expiração
- Proteção de rotas privadas

## 📡 Integração com API

### Endpoints Utilizados
- `POST /auth/login` - Autenticação
- `POST /auth/register` - Registro de usuário
- `POST /auth/refresh` - Renovação de token
- `GET /profile` - Dados do usuário
- `GET /vehicles` - Listagem de veículos
- `POST /vehicles` - Criação de veículo
- `GET /inspections` - Listagem de vistorias
- `POST /inspections` - Criação de vistoria
- `GET /reports/overview` - Relatório geral
- `GET /reports/by-inspector` - Métricas por inspetor

### Tratamento de Erros
- Interceptors Axios para tratamento global
- Retry automático em falhas de rede
- Mensagens de erro user-friendly
- Loading states em todas as operações

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas
```bash
npm run build
npm start
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Consulte as issues do repositório
3. Entre em contato com a equipe de desenvolvimento
