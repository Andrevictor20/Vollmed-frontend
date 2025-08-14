'use client';

import type { 
  DadosCadastroMedico, 
  DadosCadastroPaciente, 
  DadosAgendamentoConsulta,
  Page,
  DadosListagemMedico,
  DadosListagemPaciente
} from './types';

const API_URL = '/api';

function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}


async function fetchAPI(path: string, options: RequestInit = {}) {
  const token = getCookie('vollmed-token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`API Error: ${response.status} ${response.statusText}`, { path, errorBody });
    throw new Error(`Erro na API: ${errorBody || response.statusText}`);
  }
  
  if(response.headers.get("Content-Length") === "0" || response.status === 204) {
      return null;
  }
  
  if (response.headers.get('Content-Type')?.includes('application/json')) {
      return response.json();
  }
  
  return response.text();
}

// Medicos
export const getAllMedicos = (): Promise<Page<DadosListagemMedico>> => fetchAPI(`/medicos?size=1000`);
export const createMedico = (data: DadosCadastroMedico) => fetchAPI('/medicos', { method: 'POST', body: JSON.stringify(data) });

// Pacientes
export const getAllPacientes = (): Promise<Page<DadosListagemPaciente>> => fetchAPI(`/pacientes?size=1000`);
export const createPaciente = (data: DadosCadastroPaciente) => fetchAPI('/pacientes', { method: 'POST', body: JSON.stringify(data) });

// Consultas
export const createConsulta = (data: DadosAgendamentoConsulta) => fetchAPI('/consultas', { method: 'POST', body: JSON.stringify(data) });
