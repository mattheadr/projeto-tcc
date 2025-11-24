# Plano de Teste — NewCheck


## 1. Identificação
- Projeto: Quick Doc Meet (NewCheck)
- Responsável: Equipe de QA
- Versão analisada: código fonte fornecido (frontend Vite + React + Tailwind + Supabase)
- Data: 2025-10-13

## 2. Objetivos
- Verificar funcionalidades críticas: agendamento de consultas, lembretes (WhatsApp/Email), geração de relatórios PDF, busca por médicos, histórico de pacientes, templates médicos, upload/download de arquivos.
- Garantir integrações com Supabase, WhatsApp API e serviço de email.
- Validar UX básico e responsividade.

## 3. Escopo
- Inclui: testes funcionais, integração, regressão, UI/responsividade, segurança básica (validação de campos), e testes de scripts (send-reminders).
- Exclui: testes de performance avançados e testes de carga (a menos que requisitado).

## 4. Critérios de Entrada
- Código disponível localmente (conforme zip).
- Variáveis de ambiente necessárias configuradas (.env).
- Acesso a instância Supabase de teste ou mock.

## 5. Critérios de Saída
- Todos os casos de teste críticos (página de agendamento, envio de lembretes, geração de PDF) com resultado "Passed".
- Bugs críticos bloqueadores corrigidos.

## 6. Estratégia de Testes
- Unitários (onde aplicável) — componentes React com Jest/React Testing Library.
- Integração — chamadas a Supabase (usar sandbox ou mocks).
- E2E — testes de fluxo de usuário com Playwright ou Cypress (agendamento, confirmação, envio de lembrete).
- Scripts Node/mjs verificados via execução em ambiente isolado.

## 7. Ambiente de Teste
- Node.js LTS (conforme package.json engine).
- Browser: Chrome/Firefox (últimas).
- Supabase test project (ou supabase-js mock).
- Chaves/test accounts para WhatsApp e email (ou modos "dry-run").

## 8. Ferramentas
- Jest + React Testing Library
- Playwright ou Cypress
- Postman para testar endpoints de integração
- Git para controle de versão

## 9. Riscos
- Integrações externas (WhatsApp/Email) podem falhar por falta de credenciais.
- Acesso a Supabase é necessário para validar gravação/leitura de dados.
- Geração de PDF depende de bibliotecas e permissões no browser.
