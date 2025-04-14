/**
 * Script de teste para verificar as funcionalidades do sistema AdvoLeads
 * 
 * Este script executa testes automatizados para garantir que todas as
 * funcionalidades principais do sistema estão funcionando corretamente.
 */

// Importa as dependências necessárias
const fetch = require('node-fetch');
const assert = require('assert');

// URL base para testes (local)
const BASE_URL = 'http://localhost:3000';

// Função para executar os testes
async function runTests() {
  console.log('🧪 Iniciando testes do sistema AdvoLeads...');
  
  // Array para armazenar os resultados dos testes
  const results = [];
  
  // Função auxiliar para registrar resultados
  function logTest(name, success, error = null) {
    results.push({ name, success, error });
    if (success) {
      console.log(`✅ ${name}`);
    } else {
      console.error(`❌ ${name}: ${error}`);
    }
  }
  
  try {
    // Teste 1: Verificar se a página inicial carrega
    try {
      const response = await fetch(`${BASE_URL}`);
      assert.strictEqual(response.status, 200);
      logTest('Página inicial carrega corretamente', true);
    } catch (error) {
      logTest('Página inicial carrega corretamente', false, error.message);
    }
    
    // Teste 2: Verificar se a página de login carrega
    try {
      const response = await fetch(`${BASE_URL}/login`);
      assert.strictEqual(response.status, 200);
      logTest('Página de login carrega corretamente', true);
    } catch (error) {
      logTest('Página de login carrega corretamente', false, error.message);
    }
    
    // Teste 3: Verificar se a API de leads está funcionando
    try {
      const response = await fetch(`${BASE_URL}/api/leads`);
      assert.strictEqual(response.status, 200);
      const data = await response.json();
      assert(Array.isArray(data.leads) || data.leads === null);
      logTest('API de leads está funcionando', true);
    } catch (error) {
      logTest('API de leads está funcionando', false, error.message);
    }
    
    // Teste 4: Verificar se a API de templates está funcionando
    try {
      const response = await fetch(`${BASE_URL}/api/templates`);
      assert.strictEqual(response.status, 200);
      const data = await response.json();
      assert(Array.isArray(data.templates) || data.templates === null);
      logTest('API de templates está funcionando', true);
    } catch (error) {
      logTest('API de templates está funcionando', false, error.message);
    }
    
    // Teste 5: Verificar se a API de sequências está funcionando
    try {
      const response = await fetch(`${BASE_URL}/api/sequences`);
      assert.strictEqual(response.status, 200);
      const data = await response.json();
      assert(Array.isArray(data.sequences) || data.sequences === null);
      logTest('API de sequências está funcionando', true);
    } catch (error) {
      logTest('API de sequências está funcionando', false, error.message);
    }
    
    // Teste 6: Verificar se a API de analytics está funcionando
    try {
      const response = await fetch(`${BASE_URL}/api/analytics/dashboard?period=month`);
      assert.strictEqual(response.status, 200);
      const data = await response.json();
      assert(typeof data.totalLeads === 'number');
      logTest('API de analytics está funcionando', true);
    } catch (error) {
      logTest('API de analytics está funcionando', false, error.message);
    }
    
    // Teste 7: Verificar se a API de configuração do WhatsApp está funcionando
    try {
      const response = await fetch(`${BASE_URL}/api/whatsapp/config`);
      assert.strictEqual(response.status, 200);
      const data = await response.json();
      assert(data.config !== undefined);
      logTest('API de configuração do WhatsApp está funcionando', true);
    } catch (error) {
      logTest('API de configuração do WhatsApp está funcionando', false, error.message);
    }
    
    // Teste 8: Verificar se a página de captura de leads carrega
    try {
      const response = await fetch(`${BASE_URL}/contato`);
      assert.strictEqual(response.status, 200);
      logTest('Página de captura de leads carrega corretamente', true);
    } catch (error) {
      logTest('Página de captura de leads carrega corretamente', false, error.message);
    }
    
    // Teste 9: Verificar se a página de dashboard carrega (requer autenticação)
    try {
      const response = await fetch(`${BASE_URL}/dashboard`);
      // Pode redirecionar para login (302) ou carregar (200)
      assert(response.status === 200 || response.status === 302);
      logTest('Página de dashboard responde corretamente', true);
    } catch (error) {
      logTest('Página de dashboard responde corretamente', false, error.message);
    }
    
    // Teste 10: Verificar se a página de código de embed carrega
    try {
      const response = await fetch(`${BASE_URL}/embed-code`);
      assert.strictEqual(response.status, 200);
      logTest('Página de código de embed carrega corretamente', true);
    } catch (error) {
      logTest('Página de código de embed carrega corretamente', false, error.message);
    }
    
    // Resumo dos testes
    const totalTests = results.length;
    const passedTests = results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    
    console.log('\n📊 Resumo dos testes:');
    console.log(`Total de testes: ${totalTests}`);
    console.log(`Testes bem-sucedidos: ${passedTests}`);
    console.log(`Testes falhos: ${failedTests}`);
    
    if (failedTests === 0) {
      console.log('\n🎉 Todos os testes passaram com sucesso!');
    } else {
      console.log('\n⚠️ Alguns testes falharam. Verifique os erros acima.');
    }
    
  } catch (error) {
    console.error('❌ Erro ao executar os testes:', error);
  }
}

// Executa os testes
runTests();
