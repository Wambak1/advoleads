import { authenticateUser } from '@/lib/auth/auth-service';

/**
 * API para autenticação de usuários
 * @param {Request} request - Objeto de requisição
 * @param {Object} env - Ambiente Cloudflare com acesso ao banco de dados
 * @returns {Response} - Resposta da API
 */
export async function POST(request, { env }) {
  try {
    const { email, password } = await request.json();
    
    // Valida os campos obrigatórios
    if (!email || !password) {
      return Response.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Autentica o usuário
    const user = await authenticateUser(env, email, password);
    
    if (!user) {
      return Response.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      );
    }
    
    // Retorna os dados do usuário
    return Response.json({ user });
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    return Response.json(
      { error: 'Erro ao processar a solicitação' },
      { status: 500 }
    );
  }
}
