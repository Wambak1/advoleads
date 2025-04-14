'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * Componente para gerenciar templates de mensagens
 */
export default function TemplateManager() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    type: 'whatsapp'
  });

  // Busca os templates
  const fetchTemplates = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar templates');
      }
      
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Erro ao buscar templates:', error);
      setError('Não foi possível carregar os templates de mensagens');
    } finally {
      setLoading(false);
    }
  };

  // Carrega os dados iniciais
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Atualiza os dados do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Envia o formulário para criar um novo template
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar template');
      }
      
      // Adiciona o novo template à lista
      setTemplates(prev => [...prev, data.template]);
      
      // Limpa o formulário e fecha-o
      setFormData({
        name: '',
        content: '',
        type: 'whatsapp'
      });
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao criar template:', error);
      setError('Não foi possível criar o template');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-green-800">Templates de Mensagens</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {showForm ? 'Cancelar' : 'Novo Template'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {/* Formulário de novo template */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Novo Template</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Template
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Ex: Boas-vindas, Lembrete de Consulta"
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Mensagem
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Conteúdo da Mensagem
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows="4"
                  required
                  value={formData.content}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Digite o conteúdo da mensagem. Use {nome} para incluir o nome do lead."
                ></textarea>
                <p className="mt-1 text-sm text-gray-500">
                  Você pode usar variáveis como {'{nome}'}, {'{email}'} ou {'{telefone}'} que serão substituídas pelos dados do lead.
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Salvar Template
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {/* Lista de templates */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">Nenhum template de mensagem encontrado</p>
          <p className="text-sm text-gray-500 mt-2">
            Crie templates para usar em suas sequências de follow-up
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map(template => (
            <div key={template.id} className="border border-gray-200 rounded-md p-4 hover:shadow-md">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  {template.type}
                </span>
              </div>
              <p className="mt-2 text-gray-700 whitespace-pre-wrap">{template.content}</p>
              <div className="mt-4 flex justify-end">
                <button
                  className="text-green-600 hover:text-green-800 text-sm"
                  onClick={() => {
                    setFormData({
                      name: template.name,
                      content: template.content,
                      type: template.type
                    });
                    setShowForm(true);
                  }}
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
