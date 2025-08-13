'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_URL = 'https://vollmed.rasppi.site';

export async function login(prevState: any, data: FormData) {
  const email = data.get('email');
  const password = data.get('password');

  let responseData;
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login: email, senha: password }),
    });

    if (!response.ok) {
      return { success: false, message: 'Credenciais inválidas. Por favor, tente novamente.' };
    }
    
    responseData = await response.json();
    const token = responseData.token;

    if (!token) {
       return { success: false, message: 'Token não recebido do servidor.' };
    }
    
    cookies().set('vollmed-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

  } catch (error) {
    console.error(error);
    return { success: false, message: 'Erro ao conectar com o servidor. Tente mais tarde.' };
  }

  if (responseData.token) {
     redirect('/');
  }

  return { success: true, message: 'Login realizado com sucesso!' };
}

export async function logout() {
  cookies().delete('vollmed-token');
  redirect('/login');
}
