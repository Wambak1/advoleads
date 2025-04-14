/**
 * Código de incorporação para o widget de captura de leads
 * Este arquivo fornece o código HTML para incorporar o formulário de captura de leads em sites externos
 */

// Código de incorporação para sites externos
const embedCode = `
<!-- Início do Código de Incorporação AdvoLeads -->
<div id="advoleads-form-container" style="width: 100%; min-height: 500px; margin: 0 auto;"></div>
<script>
  (function() {
    // Cria um iframe para o formulário
    var iframe = document.createElement('iframe');
    iframe.src = 'https://[URL_DO_SEU_SITE]/embed';
    iframe.style.width = '100%';
    iframe.style.height = '500px';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.scrolling = 'no';
    
    // Adiciona o iframe ao contêiner
    var container = document.getElementById('advoleads-form-container');
    container.appendChild(iframe);
    
    // Configura o listener para mensagens do iframe
    window.addEventListener('message', function(event) {
      // Verifica se a mensagem é do nosso iframe
      if (event.data && event.data.type === 'resize') {
        // Ajusta a altura do iframe com base na mensagem
        iframe.style.height = event.data.height + 'px';
      }
    }, false);
  })();
</script>
<!-- Fim do Código de Incorporação AdvoLeads -->
`;

export default embedCode;
