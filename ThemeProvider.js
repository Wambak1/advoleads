'use client';

import { useEffect } from 'react';
import theme from '@/lib/theme';

/**
 * Componente para aplicar o tema global em tons de verde musgo
 */
export default function ThemeProvider({ children }) {
  // Aplica as variáveis CSS do tema quando o componente é montado
  useEffect(() => {
    // Define as variáveis CSS para as cores primárias
    Object.entries(theme.colors.primary).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-primary-${key}`, value);
    });
    
    // Define as variáveis CSS para as cores secundárias
    Object.entries(theme.colors.secondary).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-secondary-${key}`, value);
    });
    
    // Define as variáveis CSS para os tons de cinza
    Object.entries(theme.colors.gray).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-gray-${key}`, value);
    });
    
    // Define as variáveis CSS para as cores de estado
    document.documentElement.style.setProperty('--color-success', theme.colors.success);
    document.documentElement.style.setProperty('--color-warning', theme.colors.warning);
    document.documentElement.style.setProperty('--color-error', theme.colors.error);
    document.documentElement.style.setProperty('--color-info', theme.colors.info);
    
    // Define as variáveis CSS para as fontes
    document.documentElement.style.setProperty('--font-body', theme.fonts.body);
    document.documentElement.style.setProperty('--font-heading', theme.fonts.heading);
    
    // Define as variáveis CSS para os raios de borda
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--border-radius-${key}`, value);
    });
    
    // Define as variáveis CSS para as sombras
    Object.entries(theme.shadows).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--shadow-${key}`, value);
    });
  }, []);
  
  return children;
}
