README - NewCheck
 Visão Geral

O NewCheck é um sistema de agendamento de consultas médicas composto por:

Aplicativo (React Native + Expo) → interface do paciente e médico

API (Node.js + Express + MySQL) → lógica de autenticação, médicos, pacientes e consultas

Banco de Dados (MySQL) → persistência de dados

Docker Compose → sobe tudo com um único comando

  Tecnologias

Frontend Mobile: React Native (Expo)

Backend API: Node.js + Express

Banco: MySQL 8

Autenticação: JWT

Validações: Yup + utilitários próprios

Mapa/Localização: react-native-maps + expo-location

📂 Estrutura do Projeto
.
│ docker-compose.yml
│ README.md
│
├── newcheck-expo-v5.6/        # App (React Native + Expo)
│   ├── App.js
│   ├── screens/
│   ├── components/
│   ├── utils/
│   └── config/
│
└── newcheck-api-v5.6/         # API (Node.js + Express + MySQL)
    ├── server.js
    ├── db.js
    ├── routes/
    ├── sql/
    └── .env.example

  Rodando com Docker (recomendado)
1. Pré-requisitos

Docker + Docker Compose instalados

2. Subir tudo

Na raiz do projeto:

docker-compose up --build

3. Serviços

MySQL → porta 3306 (banco: sistema_agendamento)

API → porta 3000 (http://localhost:3000)

Scripts SQL são executados automaticamente em newcheck-api-v5.6/sql:

init_db.sql → cria tabelas

alter_add_lat_long.sql → adiciona latitude/longitude

seed_medicos.sql → insere médico/cliente de teste

Rodando o App (Expo)

1. Pré-requisitos

Node.js LTS

Expo CLI (npm install -g expo-cli ou usar npx expo)

2. Instalar dependências
cd newcheck-expo-v5.6
npm install

3. Iniciar
EXPO_PUBLIC_API_HOST="http://10.0.2.2:3000" npm start   # em emulador Android

EXPO_PUBLIC_API_HOST="http://SEU_IP_LOCAL:3000" npm start   # em dispositivo físico

4. Testar

Acesse pelo QR Code gerado no terminal ou no app Expo Go

Login/Cadastro → cria usuário paciente ou médico

Solicitar Consulta → agenda com calendário, médico disponível, horário e local no mapa

🔑 Endpoints principais da API
Autenticação Cliente

POST /api/auth/cliente/register → cadastra cliente

POST /api/auth/cliente/login → login

Autenticação Médico

POST /api/auth/medico/register → cadastra médico

POST /api/auth/medico/login → login

Médicos

GET /api/medicos/disponiveis?data=YYYY-MM-DD

Consultas

POST /api/consultas (JWT obrigatório)

GET /api/consultas?cpf=123...&crm=CRM123...

GET /api/consultas/horarios?data=YYYY-MM-DD&crm=CRM12345

🔧 Modo Local (sem Docker)
1. Criar banco manualmente
mysql -u root -p < newcheck-api-v5.6/sql/init_db.sql
mysql -u root -p < newcheck-api-v5.6/sql/seed_medicos.sql

2. Configurar .env

ajuste de credenciais

3. Rodar API
cd newcheck-api-v5.6
npm install
npm run dev

4. Rodar App (igual explicado acima)
👤 Usuários de teste

Após rodar seed_medicos.sql, você terá:

Médico:

CRM: CRM12345

Senha: Cadastro via API

Cliente:

CPF: 12345678900

Senha: Cadastro via API

Status:

 Cadastro/Login clientes e médicos

 Agendamento com data, médico, tipo, horário, preço e local no mapa

 JWT + validação de campos

 Docker Compose funcional
