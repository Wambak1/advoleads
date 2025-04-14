'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * Componente para gerenciar sequências de follow-up
 */
export default function SequenceManager() {
  const [sequences, setSequences] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    steps: [{ template_id: '', delay_hours: 0, condition: '' }]
  });

  // Busca as sequências
  const fetchSequences = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/sequences');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar sequências');
      }
      
      setSequences(data.sequences || []);
    } catch (error) {
      console.error('Erro ao buscar sequências:', error);
      setError('Não foi possível carregar as sequências de follow-up');
    } finally {
      setLoading(false);
    }
  };

  // Busca os templates disponíveis
  const fetchTemplates = async () => {
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
    }
  };

  // Carrega os dados iniciais
  useEffect(() => {
    fetchSequences();
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

  // Atualiza os dados de um passo da sequência
  const handleStepChange = (index, field, value) => {
    setFormData(prev => {
      const newSteps = [...prev.steps];
      newSteps[index] = {
        ...newSteps[index],
        [field]: value
      };
      return {
        ...prev,
        steps: newSteps
      };
    });
  };

  // Adiciona um novo passo à sequência
  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, { template_id: '', delay_hours: 0, condition: '' }]
    }));
  };

  // Remove um passo da sequência
  const removeStep = (index) => {
    setFormData(prev => {
      const newSteps = [...prev.steps];
      newSteps.splice(index, 1);
      return {
        ...prev,
        steps: newSteps.length > 0 ? newSteps : [{ template_id: '', delay_hours: 0, condition: '' }]
      };
    });
  };

  // Envia o formulário para criar uma nova sequência
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Valida se todos os passos têm um template selecionado
    const invalidSteps = formData.steps.some(step => !step.template_id);
    if (invalidSteps) {
      setError('Todos os passos devem ter um template selecionado');
      return;
    }
    
    try {
      const response = await fetch('/api/sequences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar sequência');
      }
      
      // Atualiza a lista de sequências
      fetchSequences();
      
      // Limpa o formulário e fecha-o
      setFormData({
        name: '',
        description: '',
        steps: [{ template_id: '', delay_hours: 0, condition: '' }]
      });
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao criar sequência:', error);
      setError('Não foi possível criar a sequência');
    }
  };

  // Formata o tempo de atraso para exibição
  const formatDelay = (hours) => {
    if (hours === 0) return 'Imediatamente';
    if (hours < 24) return `${hours} hora${hours > 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    return `${days} dia${days > 1 ? 's' : ''}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-green-800">Sequências de Follow-up</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {showForm ? 'Cancelar' : 'Nova Sequência'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {/* Formulário de nova sequência */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Nova Sequência de Follow-up</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Sequência
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Ex: Boas-vindas, Acompanhamento de Consulta"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="2"
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Descreva o objetivo desta sequência"
                ></textarea>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-800 mb-2">Passos da Sequência</h4>
                
                {formData.steps.map((step, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-md mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium">Passo {index + 1}</h5>
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remover
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Template de Mensagem
                        </label>
                        <select
                          value={step.template_id}
                          onChange={(e) => handleStepChange(index, 'template_id', e.target.value)}
                          required
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">Selecione um template</option>
                          {templates.map(template => (
                            <option key={template.id} value={template.id}>
                              {template.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Atraso (horas)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={step.delay_hours}
                          onChange={(e) => handleStepChange(index, 'delay_hours', parseInt(e.target.value) || 0)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          {index === 0 ? 'Tempo após entrar na sequência' : 'Tempo após o passo anterior'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Condição (opcional)
                      </label>
                      <input
                        type="text"
                        value={step.condition}
                        onChange={(e) => handleStepChange(index, 'condition', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="Ex: stage_id = 'stage_2'"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Deixe em branco para sempre executar este passo
                      </p>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addStep}
                  className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  + Adicionar Passo
                </button>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Salvar Sequência
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {/* Lista de sequências */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : sequences.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">Nenhuma sequência de follow-up encontrada</p>
          <p className="text-sm text-gray-500 mt-2">
            Crie sequências para automatizar o acompanhamento dos seus leads
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sequences.map(sequence => (
            <div key={sequence.id} className="border border-gray-200 rounded-md p-4 hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{sequence.name}</h3>
                  {sequence.description && (
                    <p className="mt-1 text-gray-600">{sequence.description}</p>
                  )}
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  sequence.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {sequence.active ? 'Ativa' : 'Inativa'}
                </span>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Passos da Sequência:</h4>
                <Link
                  href={`/dashboard/sequences/${sequence.id}`}
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  Ver detalhes e gerenciar passos
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
