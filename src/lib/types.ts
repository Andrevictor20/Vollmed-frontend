export interface DadosEndereco {
  logradouro: string;
  bairro: string;
  cep: string;
  cidade: string;
  uf: string;
  numero?: string;
  complemento?: string;
}

export interface DadosCadastroMedico {
  nome: string;
  email: string;
  telefone: string;
  crm: string;
  especialidade: 'ORTOPEDIA' | 'CARDIOLOGIA' | 'GINECOLOGIA' | 'DERMATOLOGIA';
  endereco: DadosEndereco;
}

export interface DadosListagemMedico {
  id: number;
  nome: string;
  email: string;
  crm: string;
  especialidade: 'ORTOPEDIA' | 'CARDIOLOGIA' | 'GINECOLOGIA' | 'DERMATOLOGIA';
}

export interface Page<T> {
  content: T[];
  size: number;
  number: number;
  totalPages: number;
  totalElements: number;
}

export interface DadosCadastroPaciente {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: DadosEndereco;
}

export interface DadosListagemPaciente {
  id: number;
  nome: string;
  email: string;
  cpf: string;
}

export interface DadosAgendamentoConsulta {
  idMedico?: number;
  idPaciente: number;
  data: string;
  especialidade?: 'ORTOPEDIA' | 'CARDIOLOGIA' | 'GINECOLOGIA' | 'DERMATOLOGIA';
}
