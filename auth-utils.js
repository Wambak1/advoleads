/**
 * Utilitários de autenticação para o AdvoLeads
 * 
 * Este módulo fornece funções para autenticação de usuários,
 * incluindo hash de senha, verificação de senha e geração de tokens.
 */

import { createHash, randomBytes } from 'crypto';
import { cookies } from 'next/headers';

// Constantes para autenticação
const AUTH_COOKIE_NAME = 'advoleads_auth';
const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 dias em milissegundos

/**
 * Gera um hash seguro para uma senha
 * @param {string} password - Senha em texto puro
 * @returns {string} - Hash da senha
 */
export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256')
    .update(password + salt)
    .digest('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifica se uma senha corresponde ao hash armazenado
 * @param {string} password - Senha em texto puro para verificar
 * @param {string} hashedPassword - Hash armazenado da senha
 * @returns {boolean} - Verdadeiro se a senha corresponder ao hash
 */
export function verifyPassword(password, hashedPassword) {
  const [salt, storedHash] = hashedPassword.split(':');
  const hash = createHash('sha256')
    .update(password + salt)
    .digest('hex');
  return storedHash === hash;
}

/**
 * Gera um token de autenticação para o usuário
 * @param {Object} user - Objeto do usuário
 * @returns {string} - Token de autenticação
 */
export function generateAuthToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + TOKEN_EXPIRY
  };
  
  const token = Buffer.from(JSON.stringify(payload)).toString('base64');
  return token;
}

/**
 * Define o cookie de autenticação
 * @param {string} token - Token de autenticação
 */
export function setAuthCookie(token) {
  const cookieStore = cookies();
  const expires = new Date(Date.now() + TOKEN_EXPIRY);
  
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    expires,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
}

/**
 * Remove o cookie de autenticação (logout)
 */
export function clearAuthCookie() {
  const cookieStore = cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

/**
 * Verifica e decodifica o token de autenticação
 * @returns {Object|null} - Dados do usuário ou null se inválido
 */
export function verifyAuthToken() {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  
  if (!token) return null;
  
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    // Verifica se o token expirou
    if (payload.exp < Date.now()) {
      clearAuthCookie();
      return null;
    }
    
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role
    };
  } catch (error) {
    clearAuthCookie();
    return null;
  }
}

/**
 * Verifica se o usuário está autenticado
 * @returns {boolean} - Verdadeiro se o usuário estiver autenticado
 */
export function isAuthenticated() {
  return verifyAuthToken() !== null;
}

/**
 * Verifica se o usuário tem a função de administrador
 * @returns {boolean} - Verdadeiro se o usuário for administrador
 */
export function isAdmin() {
  const user = verifyAuthToken();
  return user?.role === 'admin';
}
