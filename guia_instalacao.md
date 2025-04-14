# Guia de Instalação e Configuração - AdvoLeads

Este guia fornece instruções detalhadas para instalar, configurar e implantar o sistema AdvoLeads em um ambiente de produção.

## Requisitos do Sistema

- Node.js 16.x ou superior
- NPM 7.x ou superior
- Conta no Cloudflare (para o banco de dados D1)
- Conta no WhatsApp Business API (opcional, para integração com WhatsApp)

## Instalação Local

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/advoleads.git
cd advoleads
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure o Banco de Dados

O AdvoLeads utiliza o Cloudflare D1 como banco de dados. Para configurar:

1. Crie uma conta no Cloudflare (se ainda não tiver)
2. Instale a Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```
3. Faça login na sua conta Cloudflare:
   ```bash
   wrangler login
   ```
4. Crie um banco de dados D1:
   ```bash
   wrangler d1 create advoleads-db
   ```
5. Atualize o arquivo `wrangler.toml` com o ID do banco de dados criado
6. Execute as migrações iniciais:
   ```bash
   wrangler d1 execute advoleads-db --local --file=migrations/0001_initial.sql
   ```

### 4. Configuração do Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```
# Configurações gerais
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Configurações de autenticação
JWT_SECRET=seu_segredo_jwt_aqui
COOKIE_SECRET=seu_segredo_cookie_aqui

# Configurações do WhatsApp (opcional)
WHATSAPP_API_VERSION=v18.0
```

### 5. Execute o Servidor de Desenvolvimento

```bash
npm run dev
```

O sistema estará disponível em `http://localhost:3000`.

## Implantação em Produção

### 1. Implantação no Cloudflare Pages

O AdvoLeads pode ser facilmente implantado no Cloudflare Pages:

1. Faça login no Cloudflare Dashboard
2. Navegue até Workers & Pages > Create application > Pages
3. Conecte seu repositório Git
4. Configure as variáveis de ambiente:
   - `NODE_VERSION`: 18
   - `JWT_SECRET`: seu_segredo_jwt_aqui
   - `COOKIE_SECRET`: seu_segredo_cookie_aqui
5. Clique em "Save and Deploy"

### 2. Configuração do Banco de Dados em Produção

1. No Cloudflare Dashboard, navegue até Workers & Pages > D1
2. Crie um novo banco de dados para produção
3. Vincule o banco de dados ao seu projeto Pages:
   - Navegue até seu projeto Pages > Settings > Functions
   - Em "D1 Database Bindings", adicione um novo binding:
     - Variable name: DB
     - D1 database: selecione o banco de dados criado
4. Execute as migrações no banco de dados de produção:
   ```bash
   wrangler d1 execute advoleads-db --file=migrations/0001_initial.sql
   ```

### 3. Configuração do Domínio Personalizado

1. No Cloudflare Dashboard, navegue até seu projeto Pages > Custom domains
2. Clique em "Set up a custom domain"
3. Siga as instruções para configurar seu domínio
4. O SSL será configurado automaticamente pelo Cloudflare

## Configuração do WhatsApp Business API

Para configurar a integração com WhatsApp Business API:

1. Crie uma conta no [Facebook Developers](https://developers.facebook.com/)
2. Configure um aplicativo no Meta for Developers
3. Adicione a funcionalidade WhatsApp ao seu aplicativo
4. Configure um número de telefone para o WhatsApp Business
5. Gere um token de acesso permanente
6. Configure o webhook para receber mensagens:
   - URL do Webhook: `https://seu-dominio.com/api/whatsapp/webhook`
   - Campos a selecionar: `messages` e `message_status`
7. No AdvoLeads, acesse "WhatsApp" no menu lateral e preencha os campos com as informações obtidas

## Manutenção e Atualizações

### Backup do Banco de Dados

Recomendamos fazer backups regulares do banco de dados:

```bash
wrangler d1 backup advoleads-db
```

### Atualizações do Sistema

Para atualizar o sistema:

1. Faça pull das últimas alterações do repositório
2. Instale as dependências atualizadas:
   ```bash
   npm install
   ```
3. Execute as migrações do banco de dados (se houver):
   ```bash
   wrangler d1 execute advoleads-db --file=migrations/XXXX_update.sql
   ```
4. Reimplante a aplicação

## Solução de Problemas

### Problemas Comuns

1. **Erro de conexão com o banco de dados**:
   - Verifique se o ID do banco de dados no `wrangler.toml` está correto
   - Confirme que você está logado na conta correta do Cloudflare

2. **Problemas com a integração do WhatsApp**:
   - Verifique se o token de acesso está correto e não expirou
   - Confirme que o webhook está configurado corretamente
   - Verifique os logs para mensagens de erro específicas

3. **Erros de implantação**:
   - Verifique se todas as variáveis de ambiente estão configuradas
   - Confirme que a versão do Node.js está correta

### Logs e Monitoramento

Para visualizar logs em produção:

1. No Cloudflare Dashboard, navegue até seu projeto Pages
2. Clique na implantação mais recente
3. Navegue até a aba "Functions" para ver os logs das funções

## Suporte

Para obter suporte adicional, entre em contato através do email suporte@advoleads.com.br ou pelo WhatsApp: +5516997125038.
