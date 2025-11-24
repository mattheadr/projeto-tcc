
# 🏥 NewCheck

  

![](https://github.com/mattheadr/projeto-tcc/blob/main/documentacao/Captura%20de%20tela%202025-09-30%20084656.png?raw=true)

  

##  Sobre o Projeto

  

O **NewCheck** é um sistema de agendamento para hospitais, desenvolvido pelos alunos do curso técnico de **Desenvolvimento de Sistemas da ETEC Ermelinda Giannini Teixeira**.

  

A aplicação facilita a conexão entre **hospital, médico e paciente**, permitindo:

- Marcar e gerenciar consultas

- Visualizar agendamentos em tempo real (clientes e médicos)

- Localizar hospitais no mapa

- Garantir autenticação segura e validações

  

---

  

##  Tecnologias Utilizadas

  

-  **Frontend Mobile:** [React Native](https://reactnative.dev/) (Expo)

-  **Frontend Web:** [Next.js](https://nextjs.org/) + CSS

-  **Backend:** [Node.js](https://nodejs.org/pt) + Express

-  **Banco de Dados:** [MySQL](https://www.mysql.com/) + [supabase](https://github.com/supabase/supabase) para rodar banco na web

-  **Autenticação:** [JWT](https://jwt.io/)

-  **Validações:** [Yup](https://github.com/jquense/yup) + utilitários próprios

-  **Agente de IA:** [TensorFlow](https://github.com/tensorflow/tensorflow)

-  **Containerização:** Docker + Docker Compose

  

---

  

##  Funcionalidades

  

- Cadastro/Login de clientes e médicos

- Agendamento com **data, médico, tipo, horário, preço e localização no mapa**

- Autenticação via JWT + validação de campos

- Banco de dados com scripts SQL prontos para seed e inicialização

- Ambiente totalmente **containerizado com Docker Compose**

  

---

  

##  Estrutura do Projeto

  

```

│ docker-compose.yml

│ README.md

│

├── site/ # Aplicativo (React Native + Expo)

│ ├── App.js

│ ├── screens/

│ ├── components/

│ ├── utils/

│ └── config/

│

└── site/ # API (Node.js + Express + MySQL)

├── server.js

├── db.js

├── routes/

├── sql/

└── .env.example

```

  

---

  

##  Rodando com Docker (recomendado)

  

### 1. Pré-requisitos

- Docker + Docker Compose instalados

  

### 2. Subir containers

```bash

docker-compose  up  --build

```

  

### 3. Serviços disponíveis

-  **MySQL** → porta `3306` (banco: `sistema_agendamento`)

-  **API** → porta `3000` → http://localhost:3000

  

Scripts SQL executados automaticamente em `site/sql`:

-  `init_db.sql` → cria tabelas

-  `alter_add_lat_long.sql` → adiciona latitude/longitude

-  `seed_medicos.sql` → insere médicos/clientes de teste

  

---

  

##  Rodando o App (Expo)

  

### 1. Pré-requisitos

- Node.js LTS

- Expo CLI (`npm install -g expo-cli` ou usar `npx expo`)

  

### 2. Instalar dependências

```bash

cd  site

npm  install

```

  

### 3. Iniciar em emulador/dispositivo

```bash

EXPO_PUBLIC_API_HOST="http://10.0.2.2:3000"  npm  start  # Emulador Android

EXPO_PUBLIC_API_HOST="http://SEU_IP_LOCAL:3000"  npm  start  # Dispositivo físico

```

  

### 4. Testar

- Escaneie o QR Code no terminal com o **Expo Go**

- Crie usuários (paciente/médico)

- Solicite consultas → calendário, médico, horário e localização no mapa

- Teste autenticação e endpoints principais da API

  

---

  

##  Rodando Localmente (sem Docker)

  

### 1. Criar banco manualmente

```bash

mysql  -u  root  -p < newcheck-api-v5.6/sql/init_db.sql

mysql  -u  root  -p < newcheck-api-v5.6/sql/seed_medicos.sql

```

  

### 2. Configurar variáveis de ambiente

- Copie `.env.example` → `.env`

- Ajuste as credenciais do banco

  

### 3. Rodar API

```bash

cd  newcheck-api-v5.6

npm  install

npm  run  dev

```

  

### 4. Rodar App

```bash

cd  newcheck-expo-v5.6

npx  expo  start

```

  

---

  

##  Autores

  

- Arildo Matheus

- Davi Oliveira Lopes

- Edgard Fernandes da Costa

- Hamilton Rodrigues

  

---

  

##  Licença

  

Este projeto está licenciado sob a licença do **CPS - ETEC Ermelinda Giannini Teixeira**.

  

-  **Código Fonte:** Apache 2.0

-  **Elementos Visuais:** Creative Commons BY (via Figma)
