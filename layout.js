import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';

export const metadata = {
  title: 'AdvoLeads - Gestão de Leads para Escritórios de Advocacia',
  description: 'Sistema de gestão de leads e automação de follow-up via WhatsApp para escritórios de advocacia',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
