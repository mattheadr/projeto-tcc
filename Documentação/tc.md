# Plano de Testes – Sistema NewCheck

Este documento descreve o plano de testes do sistema **NewCheck**, incluindo todos os casos de teste para as funções de **Pacientes**, **Médicos** e do **Sistema**.  
Cada caso de teste apresenta seu identificador, objetivo, pré-condições, passos, resultado esperado e campo de status.

---

## 1. Casos de Teste – Paciente

| ID | Nome do Caso | Objetivo | Pré-Condição | Passos | Resultado Esperado | Status |
|----|---------------|-----------|---------------|---------|---------------------|---------|
| **CT-P01** | Cadastro de Paciente | Verificar se o paciente consegue se cadastrar corretamente. | O paciente deve ter acesso à tela de cadastro. | 1. Acessar a tela de cadastro.<br>2. Preencher nome, e-mail, senha e confirmar senha.<br>3. Clicar em "Cadastrar". | Paciente cadastrado com sucesso e mensagem de confirmação exibida. |  |
| **CT-P02** | Login de Paciente | Verificar se o paciente consegue realizar login. | Paciente deve estar previamente cadastrado. | 1. Acessar tela de login.<br>2. Inserir e-mail e senha válidos.<br>3. Clicar em "Entrar". | Paciente é redirecionado para a tela principal. |  |
| **CT-P03** | Agendamento de Consulta | Verificar se o paciente consegue agendar consulta. | Paciente deve estar logado. | 1. Acessar aba de agendamento.<br>2. Selecionar médico, data e horário.<br>3. Confirmar o agendamento. | Consulta é registrada e exibida na tela de histórico. |  |
| **CT-P04** | Cancelamento de Consulta | Verificar se o paciente pode cancelar consulta agendada. | Paciente deve ter consulta previamente agendada. | 1. Acessar a tela de histórico.<br>2. Selecionar consulta e clicar em "Cancelar".<br>3. Confirmar ação. | Consulta é removida da lista e status atualizado. |  |
| **CT-P05** | Visualização de Histórico | Verificar se o paciente consegue visualizar o histórico de consultas. | Paciente deve estar logado. | 1. Acessar aba "Histórico".<br>2. Verificar lista de consultas passadas e futuras. | Lista de consultas exibida corretamente. |  |

---

## 2. Casos de Teste – Médico

| ID | Nome do Caso | Objetivo | Pré-Condição | Passos | Resultado Esperado | Status |
|----|---------------|-----------|---------------|---------|---------------------|---------|
| **CT-M01** | Login de Médico | Verificar se o médico consegue realizar login com sucesso. | Médico deve estar cadastrado. | 1. Acessar tela de login.<br>2. Inserir e-mail e senha válidos.<br>3. Clicar em "Entrar". | Médico é redirecionado para o painel de consultas. |  |
| **CT-M02** | Visualizar Agenda | Verificar se o médico pode visualizar suas consultas agendadas. | Médico deve estar logado. | 1. Acessar a aba "Minha Agenda".<br>2. Visualizar lista de consultas por data e horário. | Consultas são exibidas corretamente na tela. |  |
| **CT-M03** | Confirmar Presença do Paciente | Verificar se o médico pode marcar presença de um paciente. | Consulta deve estar agendada para o médico. | 1. Acessar a consulta do dia.<br>2. Clicar em "Confirmar Presença". | Status da consulta muda para "Concluída". |  |
| **CT-M04** | Relatório de Consultas | Verificar se o médico pode gerar relatório de consultas realizadas. | Médico deve ter consultas realizadas registradas. | 1. Acessar aba "Relatórios".<br>2. Selecionar período desejado.<br>3. Clicar em "Gerar Relatório". | Relatório é exibido com dados corretos. |  |

---

## 3. Casos de Teste – Sistema

| ID | Nome do Caso | Objetivo | Pré-Condição | Passos | Resultado Esperado | Status |
|----|---------------|-----------|---------------|---------|---------------------|---------|
| **CT-S01** | Autenticação | Verificar se o sistema valida login de pacientes e médicos corretamente. | Usuários cadastrados no banco. | Tentar login com dados válidos e inválidos. | Acesso concedido apenas a credenciais válidas. |  |
| **CT-S02** | Banco de Dados | Verificar se o Supabase armazena e recupera dados corretamente. | Conexão ativa com Supabase. | Cadastrar, editar e excluir registros de usuários. | Operações CRUD funcionam conforme esperado. |  |
| **CT-S03** | Envio de Lembretes | Verificar se o sistema envia lembretes automáticos de consultas. | Consultas agendadas devem existir. | 1. Aguardar tempo configurado para envio.<br>2. Verificar notificação (e-mail ou WhatsApp). | Lembrete enviado automaticamente. |  |
| **CT-S04** | Geração de Relatórios | Verificar se o sistema gera relatórios administrativos. | Usuário administrador logado. | 1. Acessar módulo de relatórios.<br>2. Selecionar período e tipo de relatório.<br>3. Clicar em "Gerar". | Relatório exibido e exportável em PDF. |  |