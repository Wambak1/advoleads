/**
 * Serviço de autenticação para o AdvoLeads
 * 
 * Este módulo fornece funções para interagir com o banco de dados
 * para operações relacionadas à autenticação de usuários.
 */

import { hashPassword, verifyPassword, generateAuthToken, setAuthCookie, clearAuthCookie } from './auth-utils';

/**
 * Busca um usuário pelo email
 * @param {Object} env - Ambiente Cloudflare com acesso ao banco de dados
 * @param {string} email - Email do usuário
 * @returns {Promise<Object|null>} - Dados do usuário ou null se não encontrado
 */
export async function getUserByEmail(env, email) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email).all();
    
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
}

/**
 * Busca um usuário pelo ID
 * @param {Object} env - Ambiente Cloudflare com acesso ao banco de dados
 * @param {string} id - ID do usuário
 * @returns {Promise<Object|null>} - Dados do usuário ou null se não encontrado
 */
export async function getUserById(env, id) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM users WHERE id = ?'
    ).bind(id).all();
    
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
}

/**
 * Autentica um usuário com email e senha
 * @param {Object} env - Ambiente Cloudflare com acesso ao banco de dados
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<Object|null>} - Dados do usuário ou null se autenticação falhar
 */
export async function authenticateUser(env, email, password) {
  const user = await getUserByEmail(env, email);
  
  if (!user) return null;
  
  const isValid = verifyPassword(password, user.password_hash);
  
  if (!isValid) return null;
  
  // Gera token e define cookie
  const token = generateAuthToken(user);
  setAuthCookie(token);
  
  // Retorna dados do usuário sem a senha
  const { password_hash, ...userData } = user;
  return userData;
}

/**
 * Registra um novo usuário
 * @param {Object} env - Ambiente Cloudflare com acesso ao banco de dados
 * @param {Object} userData - Dados do usuário a ser registrado
 * @returns {Promise<Object|null>} - Dados do usuário criado ou null se falhar
 */
export async function registerUser(env, userData) {
  try {
    // Verifica se o email já está em uso
    const existingUser = await getUserByEmail(env, userData.email);
    if (existingUser) return null;
    
    // Gera ID único
    const id = crypto.randomUUID();
    
    // Hash da senha
    const passwordHash = hashPassword(userData.password);
    
    // Insere o usuário no banco de dados
    await env.DB.prepare(
      'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)'
    ).bind(
      id,
      userData.name,
      userData.email,
      passwordHash,
      userData.role || 'user'
    ).run();
    
    // Busca o usuário recém-criado
    const newUser = await getUserById(env, id);
    
    if (!newUser) return null;
    
    // Gera token e define cookie
    const token = generateAuthToken(newUser);
    setAuthCookie(token);
    
    // Retorna dados do usuário sem a senha
    const { password_hash, ...newUserData } = newUser;
    return newUserData;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return null;
  }
}

/**
 * Realiza o logout do usuário
 */
export function logoutUser() {
  clearAuthCookie();
}
