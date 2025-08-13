import { cookies } from 'next/headers';
import type { 
  DadosCadastroMedico, 
  DadosCadastroPaciente, 
  DadosAgendamentoConsulta,
  Page,
  DadosListagemMedico,
  DadosListagemPaciente
} from './types';

const API_URL = 'https://vollmed.rasppi.site';

async function getAuthToken() {
  return cookies().get('vollmed-token')?.value;
}

async function fetchAPI(path: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`API Error: ${response.status} ${response.statusText}`, { path, errorBody });
      throw new Error(`Erro na API: ${response.statusText}`);
    }
    
    if(response.headers.get("Content-Length") === "0" || response.status === 204) {
        return null;
    }

    if (response.headers.get('Content-Type')?.includes('application/json')) {
        return response.json();
    }
    
    return response.text();

  } catch (error) {
    console.error('Fetch API Error:', error);
    throw error;
  }
}

// Medicos
export const getMedicos = (page: number, size: number): Promise<Page<DadosListagemMedico>> => fetchAPI(`/medicos?page=${page}&size=${size}`);
export const getAllMedicos = (): Promise<Page<DadosListagemMedico>> => fetchAPI(`/medicos?size=1000`);
export const createMedico = (data: DadosCadastroMedico) => fetchAPI('/medicos', { method: 'POST', body: JSON.stringify(data) });

// Pacientes
export const getPacientes = (page: number, size: number): Promise<Page<DadosListagemPaciente>> => fetchAPI(`/pacientes?page=${page}&size=${size}`);
export const getAllPacientes = (): Promise<Page<DadosListagemPaciente>> => fetchAPI(`/pacientes?size=1000`);
export const createPaciente = (data: DadosCadastroPaciente) => fetchAPI('/pacientes', { method: 'POST', body: JSON.stringify(data) });

// Consultas
export const createConsulta = (data: DadosAgendamentoConsulta) => fetchAPI('/consultas', { method: 'POST', body: JSON.stringify(data) });
