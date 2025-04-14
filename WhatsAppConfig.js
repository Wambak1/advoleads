'use client';

import { useState, useEffect } from 'react';

/**
 * Componente para configuração da integração com WhatsApp Business API
 */
export default function WhatsAppConfig() {
  const [config, setConfig] = useState({
    phone_number: '',
    business_account_id: '',
    phone_number_id: '',
    access_token: '',
    api_version: 'v18.0',
    webhook_secret: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  // Busca a configuração atual
  const fetchConfig = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/whatsapp/config');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar configuração');
      }
      
      if (data.config) {
        setIsConfigured(data.config.is_configured || false);
        
        // Preenche os campos com os valores existentes
        setConfig({
          phone_number: data.config.phone_number || '',
          business_account_id: data.config.business_account_id || '',
          phone_number_id: data.config.phone_number_id || '',
          access_token: '', // Não exibe o token por segurança
          api_version: data.config.api_version || 'v18.0',
          webhook_secret: '' // Não exibe o segredo por segurança
        });
      }
    } catch (error) {
      console.error('Erro ao buscar configuração:', error);
      setError('Não foi possível carregar a configuração atual');
    } finally {
      setLoading(false);
    }
  };

  // Carrega a configuração inicial
  useEffect(() => {
    fetchConfig();
  }, []);

  // Atualiza os dados do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Envia o formulário para salvar a configuração
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    
    try {
      const response = await fetch('/api/whatsapp/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar configuração');
      }
      
      setSuccess(true);
      setIsConfigured(true);
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      setError('Não foi possível salvar a configuração');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-green-800 mb-4">Configuração do WhatsApp Business API</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700">Configuração salva com sucesso!</p>
            </div>
          )}
          
          <div className="mb-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Informações importantes</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Para configurar a integração com o WhatsApp Business API, você precisará:</p>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Criar uma conta no <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook Developers</a></li>
                      <li>Configurar um aplicativo no Meta for Developers</li>
                      <li>Adicionar a funcionalidade WhatsApp ao seu aplicativo</li>
                      <li>Configurar um número de telefone para o WhatsApp Business</li>
                      <li>Gerar um token de acesso permanente</li>
                    </ol>
                    <p className="mt-2">
                      <a href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Consulte a documentação oficial para mais detalhes
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Telefone
                </label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  required
                  value={config.phone_number}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Ex: 5516997125038"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Formato internacional sem o sinal de + (ex: 5516997125038)
                </p>
              </div>
              
              <div>
                <label htmlFor="business_account_id" className="block text-sm font-medium text-gray-700 mb-1">
                  ID da Conta Business
                </label>
                <input
                  type="text"
                  id="business_account_id"
                  name="business_account_id"
                  required
                  value={config.business_account_id}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Ex: 123456789012345"
                />
              </div>
              
              <div>
                <label htmlFor="phone_number_id" className="block text-sm font-medium text-gray-700 mb-1">
                  ID do Número de Telefone
                </label>
                <input
                  type="text"
                  id="phone_number_id"
                  name="phone_number_id"
                  required
                  value={config.phone_number_id}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Ex: 123456789012345"
                />
              </div>
              
              <div>
                <label htmlFor="api_version" className="block text-sm font-medium text-gray-700 mb-1">
                  Versão da API
                </label>
                <input
                  type="text"
                  id="api_version"
                  name="api_version"
                  value={config.api_version}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Ex: v18.0"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="access_token" className="block text-sm font-medium text-gray-700 mb-1">
                  Token de Acesso
                </label>
                <input
                  type="password"
                  id="access_token"
                  name="access_token"
                  required
                  value={config.access_token}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder={isConfigured ? "••••••••••••••••••••••••••••••••" : "Insira seu token de acesso permanente"}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {isConfigured ? "Deixe em branco para manter o token atual" : "Token de acesso permanente gerado no Meta for Developers"}
                </p>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="webhook_secret" className="block text-sm font-medium text-gray-700 mb-1">
                  Segredo do Webhook (opcional)
                </label>
                <input
                  type="password"
                  id="webhook_secret"
                  name="webhook_secret"
                  value={config.webhook_secret}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder={isConfigured ? "••••••••••••••••••••••••••••••••" : "Insira o segredo para verificação do webhook"}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {isConfigured ? "Deixe em branco para manter o segredo atual" : "Usado para verificar as chamadas de webhook do WhatsApp"}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar Configuração'}
              </button>
            </div>
          </form>
          
          {isConfigured && (
            <div className="mt-8 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Configuração do Webhook</h3>
              <p className="text-gray-700 mb-4">
                Para receber mensagens e atualizações de status, configure o webhook do WhatsApp com as seguintes informações:
              </p>
              
              <div className="bg-white p-3 border border-gray-300 rounded-md mb-4">
                <p className="font-mono text-sm break-all">
                  URL do Webhook: <span className="text-green-600">https://seu-dominio.com/api/whatsapp/webhook</span>
                </p>
              </div>
              
              <p className="text-gray-700">
                Lembre-se de selecionar os campos <strong>messages</strong> e <strong>message_status</strong> ao configurar o webhook no Meta for Developers.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
