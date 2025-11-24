# Manual do Desenvolvedor — NewCheck

## Visão Geral
- Frontend: Vite + React (TypeScript) + TailwindCSS.
- Backend: Supabase (autenticação e banco de dados).
- Scripts: Node/mjs scripts em `scripts/` para lembretes e setup.

## Requisitos
- Node.js (LTS recomendado)
- npm
- Conta Supabase para dev/test
- Chaves para WhatsApp Business API / SMTP para email (ou modo de teste)

## Instalação Local
1. Copie o repositório para sua máquina.
2. Crie arquivo `.env` na raiz (baseado em `.env.example` se disponível) com:
   - SUPABASE_URL, SUPABASE_ANON_KEY, SMTP_* (se necessário), WHATSAPP_API_KEY, etc.
3. Instale dependências:
   ```
   npm install
   ```
4. Rodar em desenvolvimento:
   ```
   npm run dev
   ```
5. Build:
   ```
   npm run build
   ```

## Estrutura de Pastas (resumida)
- `src/` — código-fonte React
  - `components/` — componentes principais (AppointmentScheduler.tsx, PatientAttendanceReport.tsx, ...)
  - `integrations/` — clientes (ex.: supabase client)
  - `scripts/` — scripts utilitários (lembretes, setup)
  - `assets/` — imagens e recursos estáticos
- `public/` — arquivos públicos

## Integrações
- **Supabase**: revisar `src/integrations/supabase/client.ts` para configuração.
- **Email**: `scripts/setup-gmail.js` contém configuração de envio via Gmail.
- **WhatsApp**: `scripts/send-whatsapp-reminders.mjs` — ajuste endpoints e credenciais.

## Execução dos Scripts de Lembretes (exemplo)
- Teste em modo dry-run:
  ```
  node --experimental-modules scripts/send-reminders.mjs --dry-run
  ```
- Produção (com cuidado):
  ```
  node --experimental-modules scripts/send-reminders.mjs
  ```

## Testes
- Recomenda-se adicionar Jest + React Testing Library.
- Para E2E, configurar Playwright/Cypress com base URL apontando para ambiente dev.

## Boas práticas e Contribuição
- Use branch por funcionalidade.
- Faça pull requests com descrição clara.
- Inclua testes para novos componentes.

## Observações de Segurança
- Nunca commitar `.env` com chaves reais.
- Habilitar regras de segurança no Supabase (Row Level Security) para produção.