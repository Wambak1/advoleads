import { NextResponse } from 'next/server';
import { authMiddleware } from './src/lib/auth/auth-middleware';

// Configuração do middleware para toda a aplicação
export function middleware(request) {
  // Rotas públicas que não requerem autenticação
  const publicPaths = [
    '/login',
    '/register',
    '/api/auth/login',
    '/api/auth/register',
    '/_next',
    '/favicon.ico',
  ];
  
  // Rotas que requerem privilégios de administrador
  const adminPaths = [
    '/admin',
    '/api/admin',
  ];
  
  const path = new URL(request.url).pathname;
  
  // Verifica se a rota requer privilégios de administrador
  const requireAdmin = adminPaths.some(adminPath => path.startsWith(adminPath));
  
  return authMiddleware(request, { requireAdmin, publicPaths });
}

// Configuração de correspondência de rotas para o middleware
export const config = {
  matcher: [
    // Aplica o middleware a todas as rotas exceto recursos estáticos
    '/((?!_next/static|_next/image|images|assets).*)',
  ],
};
