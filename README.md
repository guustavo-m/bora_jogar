# 🏟️ Bora Jogar

Bem-vindo ao projeto **Bora Jogar**, uma plataforma para conectar pessoas que querem encontrar partidas esportivas, participar de jogos e organizar encontros em quadras, campos e academias.

## 🚀 Visão Geral

O sistema foi desenvolvido com uma arquitetura full-stack composta por:

- Frontend em React + Vite
- Backend em Node.js + Express
- Banco de dados PostgreSQL
- Autenticação com JWT
- Rotas protegidas para usuários autenticados

A aplicação permite que pessoas criem partidas, filtrem por esporte, visualizem detalhes, se cadastrem e gerenciem seu perfil.

## ✨ Funcionalidades

- Cadastro e login de usuários
- Autenticação segura com token JWT
- Criação de partidas esportivas
- Visualização de partidas disponíveis
- Detalhamento de cada partida
- Filtro por esporte
- Perfil do usuário
- Gestão de participações em partidas
- Interface responsiva para desktop e mobile

## 🧱 Tecnologias Utilizadas

### Frontend
- React
- Vite
- React Router DOM
- Tailwind CSS
- React Icons

### Backend
- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt
- CORS
- dotenv

## 📁 Estrutura do Projeto

```bash
bora_jogar/
├── backend/
│   ├── src/
│   ├── app.js
│   ├── schema.sql
│   ├── .env.example
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── index.html
├── README.md
└── package-lock.json
```

## ⚙️ Pré-requisitos

Antes de rodar o projeto, tenha instalado em sua máquina:

- Node.js 18+
- npm ou yarn
- PostgreSQL

## ▶️ Como Executar

### 1) Clone o repositório

```bash
git clone <url-do-repositorio>
cd bora_jogar
```

### 2) Configure o ambiente do backend

Acesse a pasta `backend` e copie o arquivo de exemplo:

```bash
cd backend
copy .env.example .env
```

Edite o arquivo `.env` com as informações do seu PostgreSQL e do JWT:

```env
DB_USER=seu_usuario_postgres
DB_HOST=localhost
DB_NAME=nome_do_banco
DB_PASSWORD=sua_senha
DB_PORT=5432
JWT_SECRET=sua_chave_secreta
PORT=3000
NODE_ENV=development
```

### 3) Instale as dependências do backend

```bash
npm install
```

### 4) Inicie o backend

```bash
npm start
```

O servidor ficará disponível em:

```bash
http://localhost:3000
```

### 5) Configure o ambiente do frontend

Acesse a pasta `frontend` e copie o arquivo `.env.example`:

```bash
cd ../frontend
copy .env.example .env
```

O arquivo pode ficar assim:

```env
VITE_API_URL=http://localhost:3000
```

### 6) Instale as dependências do frontend

```bash
npm install
```

### 7) Inicie o frontend

```bash
npm run dev
```

A aplicação será aberta em:

```bash
http://localhost:5173
```

## 🗄️ Banco de Dados

O projeto utiliza PostgreSQL com schema já preparado em `backend/schema.sql`.

Esse arquivo cria as tabelas de:

- usuários
- esportes
- partidas
- participações

## 👤 Fluxo de Uso

1. Faça seu cadastro no sistema
2. Faça login com seu usuário
3. Explore as partidas disponíveis
4. Crie uma nova partida se desejar organizar um evento
5. Participe de jogos e acompanhe os detalhes

## 🛠️ Scripts Úteis

### Backend
```bash
npm start
```

### Frontend
```bash
npm run dev
npm run build
npm run preview
```

## 📌 Observações

- As rotas de usuário e perfil são protegidas por autenticação.
- O backend expõe a API em `/api/auth` para login e cadastro.
- A aplicação foi pensada para facilitar a organização de encontros esportivos entre pessoas.

## 🤝 Contribuição

Contribuições são bem-vindas! Para colaborar:

1. Faça um fork do projeto
2. Crie uma branch para sua funcionalidade
3. Realize suas alterações
4. Abra um pull request com uma descrição clara

## 🏁 Status do Projeto

O projeto está em desenvolvimento e sendo aprimorado para oferecer uma experiência completa de organização de partidas esportivas.

---

## 👨‍💻 Autores do Projeto - Grupo 2 - SENAI

- Manuella da Silva Piva (líder)
- Ayla Cristina da Silva Vilela (vice-líder)
- Gabriella Camacho Stavarengo
- Gustavo Millamonte
- Maria Vitória Guedes Ferreira