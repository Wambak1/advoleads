-- Inicialização do banco de dados para o AdvoLeads
-- Sistema de gestão de leads para escritórios de advocacia

-- Tabela de usuários (advogados e administradores)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user', -- 'admin' ou 'user'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de leads (potenciais clientes)
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  source TEXT, -- origem do lead (site, indicação, etc.)
  notes TEXT,
  created_by TEXT REFERENCES users(id),
  assigned_to TEXT REFERENCES users(id),
  stage_id TEXT REFERENCES stages(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de estágios do funil (pipeline)
CREATE TABLE IF NOT EXISTS stages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  color TEXT DEFAULT '#4CAF50', -- cor verde padrão
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de mensagens/interações
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id),
  user_id TEXT REFERENCES users(id),
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'whatsapp', -- 'whatsapp', 'email', 'call', etc.
  direction TEXT NOT NULL DEFAULT 'outbound', -- 'inbound' ou 'outbound'
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'read', 'failed'
  scheduled_for TIMESTAMP,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de configurações do WhatsApp Business API
CREATE TABLE IF NOT EXISTS whatsapp_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  phone_number TEXT,
  business_account_id TEXT,
  access_token TEXT,
  api_version TEXT DEFAULT 'v18.0',
  webhook_secret TEXT,
  is_configured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir estágios padrão do funil
INSERT INTO stages (id, name, description, order_index, color) VALUES
('stage_1', 'Novo Lead', 'Leads recém-captados que ainda não foram contatados', 1, '#4CAF50'),
('stage_2', 'Primeiro Contato', 'Leads que já receberam a primeira mensagem', 2, '#8BC34A'),
('stage_3', 'Em Negociação', 'Leads que responderam e estão em conversação', 3, '#CDDC39'),
('stage_4', 'Proposta Enviada', 'Leads que receberam proposta formal', 4, '#FFC107'),
('stage_5', 'Contrato Fechado', 'Leads convertidos em clientes', 5, '#2E7D32'),
('stage_6', 'Perdido', 'Leads que não avançaram no processo', 6, '#F44336');

-- Inserir usuário administrador padrão (senha: admin123)
INSERT INTO users (id, name, email, password_hash, role) VALUES
('admin_default', 'Administrador', 'admin@advoleads.com', '$2a$10$8KVj8IFRdvZzIh.UCH/3UO2RA.vo4.XY4qP/am4G/6jt0zIjW0HyG', 'admin');
