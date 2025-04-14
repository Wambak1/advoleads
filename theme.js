/**
 * Arquivo de configuração de tema para o AdvoLeads
 * 
 * Define as cores e estilos principais do sistema em tons de verde musgo
 */

const theme = {
  colors: {
    // Tons de verde musgo
    primary: {
      50: '#f0f5f1',
      100: '#dce8de',
      200: '#bdd4c0',
      300: '#9bbfa0',
      400: '#7aaa81',
      500: '#5d9566', // Verde musgo principal
      600: '#4a7a52',
      700: '#3c6042',
      800: '#2e4a33',
      900: '#1f3323',
    },
    // Cores complementares
    secondary: {
      50: '#f5f8f0',
      100: '#e8efd9',
      200: '#d4e0b8',
      300: '#bfd096',
      400: '#aac075',
      500: '#95b054',
      600: '#7a9043',
      700: '#617035',
      800: '#495528',
      900: '#30391b',
    },
    // Tons de cinza
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    // Cores de estado
    success: '#2e7d32',
    warning: '#f9a825',
    error: '#d32f2f',
    info: '#0288d1',
  },
  
  // Configurações de fonte
  fonts: {
    body: 'Inter, system-ui, sans-serif',
    heading: 'Inter, system-ui, sans-serif',
  },
  
  // Configurações de borda
  borderRadius: {
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.5rem',
    xl: '1rem',
    full: '9999px',
  },
  
  // Configurações de sombra
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};

export default theme;
