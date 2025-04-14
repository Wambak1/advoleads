/**
 * Middleware de autenticação para o AdvoLeads
 * 
 * Este middleware protege rotas que requerem autenticação
 * e redireciona usuários não autenticados para a página de login.
 */

import { NextResponse } from 'next/server';
import { verifyAuthToken } from './auth-utils';

/**
 * Verifica se o usuário está autenticado e tem permissão para acessar a rota
 * @param {Request} request - Objeto de requisição
 * @param {Object} options - Opções do middleware
 * @returns {NextResponse} - Resposta do middleware
 */
export function authMiddleware(request, options = {}) {
  const { requireAdmin = false, publicPaths = [] } = options;
  const path = new URL(request.url).pathname;
  
  // Verifica se a rota é pública
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }
  
  // Verifica se o usuário está autenticado
  const user = verifyAuthToken();
  
  if (!user) {
    // Redireciona para a página de login
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Verifica se a rota requer privilégios de administrador
  if (requireAdmin && user.role !== 'admin') {
    // Redireciona para a página inicial
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}
