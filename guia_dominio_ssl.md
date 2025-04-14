# Guia de Configuração de Domínio e SSL - AdvoLeads

Este guia fornece instruções detalhadas para configurar seu próprio domínio ou subdomínio e certificado SSL para o sistema AdvoLeads.

## Configuração de Subdomínio

Para configurar um subdomínio para o AdvoLeads (por exemplo, advoleads.seudominio.com.br):

### 1. Acesse o Painel de Controle do seu Provedor de Hospedagem

Faça login no painel de controle do seu provedor de hospedagem onde seu domínio principal está registrado.

### 2. Localize a Seção de Gerenciamento de DNS

Normalmente, esta seção é chamada de "DNS", "Zonas DNS", "Gerenciador de DNS" ou similar.

### 3. Adicione um Registro CNAME

1. Clique em "Adicionar Registro" ou opção similar
2. Selecione o tipo de registro "CNAME"
3. No campo "Nome" ou "Host", digite o subdomínio desejado (ex: "advoleads")
4. No campo "Valor" ou "Destino", insira o domínio fornecido pelo serviço de hospedagem onde o AdvoLeads está implantado
   - Se estiver usando Cloudflare Pages: [seu-projeto].pages.dev
   - Se estiver usando Vercel: [seu-projeto].vercel.app
   - Se estiver usando Netlify: [seu-projeto].netlify.app
5. TTL (Time to Live): deixe o valor padrão ou use 3600 (1 hora)
6. Salve as alterações

### 4. Verifique a Propagação do DNS

A propagação do DNS pode levar de alguns minutos até 48 horas, dependendo do seu provedor. Você pode verificar o status da propagação usando ferramentas como:
- https://www.whatsmydns.net/
- https://dnschecker.org/

## Configuração de SSL

### Opção 1: SSL Automático com Cloudflare Pages (Recomendado)

Se você estiver usando o Cloudflare Pages para hospedar o AdvoLeads (conforme recomendado no guia de instalação):

1. Faça login no Dashboard do Cloudflare
2. Navegue até Workers & Pages > seu projeto
3. Clique na aba "Custom domains"
4. Clique em "Set up a custom domain"
5. Digite seu subdomínio (ex: advoleads.seudominio.com.br)
6. Siga as instruções para verificar a propriedade do domínio
7. O Cloudflare emitirá automaticamente um certificado SSL para seu domínio

### Opção 2: SSL com Let's Encrypt

Se você estiver usando outro serviço de hospedagem:

1. Acesse o painel de controle do seu serviço de hospedagem
2. Localize a seção de SSL/TLS ou Segurança
3. Procure por opções como "Let's Encrypt", "SSL Gratuito" ou similar
4. Selecione seu domínio/subdomínio e siga as instruções para emitir o certificado
5. A maioria dos serviços modernos de hospedagem oferece renovação automática de certificados

### Opção 3: SSL com Cloudflare (Proxy)

Você pode usar o Cloudflare como proxy para adicionar SSL ao seu site:

1. Crie uma conta no Cloudflare (se ainda não tiver)
2. Adicione seu domínio ao Cloudflare
3. Atualize os servidores DNS do seu domínio para os fornecidos pelo Cloudflare
4. No painel do Cloudflare, vá para SSL/TLS > Overview
5. Selecione "Flexible" ou "Full" (recomendado se seu host de origem suportar HTTPS)
6. Ative o HTTPS automático em SSL/TLS > Edge Certificates

## Verificação da Configuração

Após configurar seu domínio e SSL, verifique se tudo está funcionando corretamente:

1. Acesse seu site através do subdomínio configurado (ex: https://advoleads.seudominio.com.br)
2. Verifique se o cadeado de segurança aparece na barra de endereço do navegador
3. Teste as funcionalidades principais do sistema para garantir que tudo está funcionando

## Solução de Problemas

### Problema: O subdomínio não está acessível

- Verifique se o registro CNAME foi configurado corretamente
- Confirme se o DNS propagou usando ferramentas de verificação de DNS
- Verifique se o serviço de hospedagem está online

### Problema: Erro de SSL/Certificado Inválido

- Verifique se o certificado SSL foi emitido para o domínio correto
- Confirme se o certificado não expirou
- Se estiver usando Cloudflare, verifique se o modo SSL está configurado corretamente

### Problema: Redirecionamento Incorreto

- Verifique as configurações de redirecionamento no seu serviço de hospedagem
- Confirme se as configurações de HTTPS estão ativadas

## Suporte

Se você encontrar dificuldades na configuração do domínio ou SSL, entre em contato através do email suporte@advoleads.com.br ou pelo WhatsApp: +5516997125038.
