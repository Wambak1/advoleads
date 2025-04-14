/**
 * Utilitário para integração com a API do WhatsApp Business
 * 
 * Este módulo fornece funções para interagir com a API oficial do WhatsApp Business (Cloud API)
 * https://developers.facebook.com/docs/whatsapp/cloud-api/
 */

/**
 * Envia uma mensagem via WhatsApp Business API
 * @param {Object} config - Configuração da API do WhatsApp
 * @param {string} to - Número de telefone do destinatário (formato internacional sem +)
 * @param {string} message - Conteúdo da mensagem
 * @returns {Promise<Object>} - Resposta da API
 */
export async function sendWhatsAppMessage(config, to, message) {
  try {
    // Verifica se a configuração é válida
    if (!config || !config.access_token || !config.phone_number_id) {
      throw new Error('Configuração do WhatsApp incompleta');
    }
    
    // Formata o número de telefone (remove caracteres não numéricos)
    const formattedNumber = to.replace(/\D/g, '');
    
    // Prepara o corpo da requisição
    const body = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedNumber,
      type: 'text',
      text: {
        preview_url: false,
        body: message
      }
    };
    
    // Envia a requisição para a API do WhatsApp
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${config.phone_number_id}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.access_token}`
        },
        body: JSON.stringify(body)
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Erro ao enviar mensagem');
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao enviar mensagem WhatsApp:', error);
    throw error;
  }
}

/**
 * Processa uma mensagem recebida do webhook do WhatsApp
 * @param {Object} webhookData - Dados recebidos do webhook
 * @returns {Object|null} - Dados da mensagem processada ou null se não for uma mensagem válida
 */
export function processWhatsAppWebhook(webhookData) {
  try {
    // Verifica se é uma mensagem válida
    if (!webhookData?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
      return null;
    }
    
    const entry = webhookData.entry[0];
    const change = entry.changes[0];
    const value = change.value;
    const message = value.messages[0];
    
    // Extrai os dados relevantes
    const result = {
      from: message.from,
      timestamp: message.timestamp,
      type: message.type,
      id: message.id
    };
    
    // Extrai o conteúdo da mensagem com base no tipo
    if (message.type === 'text' && message.text) {
      result.content = message.text.body;
    } else if (message.type === 'image' && message.image) {
      result.content = message.image.caption || 'Imagem recebida';
      result.mediaId = message.image.id;
    } else if (message.type === 'audio' && message.audio) {
      result.content = 'Áudio recebido';
      result.mediaId = message.audio.id;
    } else if (message.type === 'document' && message.document) {
      result.content = message.document.caption || 'Documento recebido';
      result.mediaId = message.document.id;
      result.filename = message.document.filename;
    } else {
      result.content = `Mensagem do tipo ${message.type} recebida`;
    }
    
    return result;
  } catch (error) {
    console.error('Erro ao processar webhook do WhatsApp:', error);
    return null;
  }
}

/**
 * Substitui variáveis em um template de mensagem com dados do lead
 * @param {string} template - Template da mensagem com variáveis
 * @param {Object} lead - Dados do lead
 * @returns {string} - Mensagem com variáveis substituídas
 */
export function replaceTemplateVariables(template, lead) {
  if (!template || !lead) return template;
  
  let result = template;
  
  // Substitui variáveis comuns
  const variables = {
    '{nome}': lead.name || '',
    '{email}': lead.email || '',
    '{telefone}': lead.phone || '',
    '{origem}': lead.source || ''
  };
  
  // Realiza as substituições
  for (const [variable, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(variable, 'g'), value);
  }
  
  return result;
}
