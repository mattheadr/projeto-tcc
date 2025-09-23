README - NewCheck

## Descrição 

Este projeto consiste em um sistema de agendamento para hospitais pelos alunos do curso técnico de Desenvolvimento de Sistemas da ETEC Ermelinda Giannini Teixeira.
A aplicação permite que os usuários marquem consultas, controlem seus horários, permite a verificação de consultas marcadas(tanto para clientes quanto para médicos) e facilita a conexão hospital-paciente

## Tecnologias utilizadas

-Frontend Mobile: React Native (Expo)

-Frontend: CSS + Next.js

-Backend: Javascript + react-native

-Backend API: Node.js + Express

-Banco: MySQL 

-Autenticação: JWT

Validações: Yup + utilitários próprios

Mapa/Localização: react-native-maps + expo-location

## Funcionalidades
 -Cadastro/Login clientes e médicos
 
 -Agendamento com data, médico, tipo, horário, preço e local no mapa
 
 -JWT + validação de campos
 
 -Docker Compose funcional

## Estrutura do Projeto
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

## Rodando com Docker (recomendado)
1. Pré-requisitos

Docker + Docker Compose instalados

2. Subir tudo

Na raiz do projeto:

docker-compose up --build

3. Serviços

MySQL → porta 3306 (banco: sistema_agendamento)

API → porta 3000 (http://localhost:3000)

Scripts SQL são executados automaticamente em newcheck-api/sql:

init_db.sql → cria tabelas

alter_add_lat_long.sql → adiciona latitude/longitude

seed_medicos.sql → insere médico/cliente de teste

## Rodando o App (Expo)

1. Pré-requisitos

Node.js LTS

Expo CLI (npm install -g expo-cli ou usar npx expo)

2. Instalar dependências
cd newcheck-expo
npm install

3. Iniciar
EXPO_PUBLIC_API_HOST="http://10.0.2.2:3000" npm start   # em emulador Android

EXPO_PUBLIC_API_HOST="http://SEU_IP_LOCAL:3000" npm start   # em dispositivo físico

4. Testar

Acesse pelo QR Code gerado no terminal ou no app Expo Go

Login/Cadastro → cria usuário paciente ou médico

Solicitar Consulta → agenda com calendário, médico disponível, horário e local no mapa

Endpoints principais da API
Autenticação Cliente


 Modo Local (sem Docker)
1. Criar banco manualmente
mysql -u root -p < newcheck-api-v5.6/sql/init_db.sql
mysql -u root -p < newcheck-api-v5.6/sql/seed_medicos.sql

2. Configurar .env

ajuste de credenciais

3. Rodar API
cd newcheck-api
npm install
npm run dev

4. Rodar Seed
 Usuários de teste

5. Rodar app

npx expo start

 ## Autores
 -Arildo Matheus
 
 -Davi Oliveira Lopes
 
 -Edgard Fernandes da Costa
 
 -Hamilton Rodrigues

 ## Licença 

Este projeto está licenciado sob a licença do CPS - ETEC ERMELINDA GIANNINI TEIXEIRA. 

Código Fonte sob licença APACHE 2.0 

Elementos Visuais sob Creative Commons By Figma
