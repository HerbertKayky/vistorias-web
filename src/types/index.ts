// Tipos de autenticação
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Tipos de veículos
export interface Vehicle {
  id: string;
  nome: string;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  proprietario: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    vistorias: number;
  };
}

export interface VehicleWithVistorias extends Vehicle {
  vistorias: Vistoria[];
}

export interface CreateVehicleRequest {
  nome: string;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  proprietario: string;
}

// Tipos de vistorias/inspeções (corrigidos para corresponder ao backend)
export interface ChecklistItem {
  id?: string;
  key: string;
  status: "APROVADO" | "REPROVADO" | "NAO_APLICAVEL";
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Vistoria {
  id: string;
  titulo: string;
  descricao?: string;
  status: "PENDENTE" | "EM_ANDAMENTO" | "APROVADA" | "REPROVADA" | "CANCELADA";
  dataInicio: string;
  dataFim?: string;
  tempoGasto?: number; // em minutos
  observacoes?: string;
  inspectorId: string;
  inspector: User;
  vehicleId: string;
  vehicle: Vehicle;
  checklistItems: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

// Alias para manter compatibilidade
export type Inspection = Vistoria;
export type InspectionItem = ChecklistItem;

export interface CreateInspectionRequest {
  titulo: string;
  descricao?: string;
  vehicleId: string;
  inspectorId: string;
  items: {
    key: string;
    status: "APROVADO" | "REPROVADO" | "NAO_APLICAVEL";
    comment?: string;
  }[];
}

export interface UpdateInspectionRequest {
  titulo?: string;
  descricao?: string;
  observacoes?: string;
  items?: {
    key: string;
    status: "APROVADO" | "REPROVADO" | "NAO_APLICAVEL";
    comment?: string;
  }[];
}

// Tipos de filtros
export interface InspectionFilters {
  status?: "PENDENTE" | "EM_ANDAMENTO" | "APROVADA" | "REPROVADA" | "CANCELADA";
  inspectorId?: string;
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Tipos de relatórios
export interface ReportOverview {
  total: number;
  aprovadas: number;
  reprovadas: number;
  tempoMedio: number; // em minutos
  periodo: {
    from: string;
    to: string;
  };
}

export interface InspectorReport {
  inspectorId: string;
  inspectorName: string;
  email: string;
  totalInspections: number;
  approvedInspections: number;
  rejectedInspections: number;
  averageTimeSpent: number; // em minutos
  statusCounts: {
    PENDENTE: number;
    EM_ANDAMENTO: number;
    APROVADA: number;
    REPROVADA: number;
    CANCELADA: number;
  };
  approvalRate?: number; // calculado opcionalmente
}

// Novos tipos para relatórios detalhados
export interface DetailedInspectionReport {
  id: string;
  titulo: string;
  status: "PENDENTE" | "EM_ANDAMENTO" | "APROVADA" | "REPROVADA" | "CANCELADA";
  dataInicio: string;
  dataFim?: string;
  tempoGasto?: number;
  observacoes?: string;
  veiculo: {
    nome: string;
    placa: string;
    marca: string;
    modelo: string;
    ano: number;
    proprietario: string;
  };
  inspector: {
    nome: string;
    email: string;
  };
  checklist: {
    totalItens: number;
    itensAprovados: number;
    itensReprovados: number;
    itensNaoAplicaveis: number;
  };
}

export interface DetailedInspectorReport {
  id: string;
  nome: string;
  email: string;
  totalVistorias: number;
  aprovadas: number;
  reprovadas: number;
  pendentes: number;
  emAndamento: number;
  canceladas: number;
  tempoMedio: number;
  taxaAprovacao: number;
}

export interface BrandReport {
  marca: string;
  totalVistorias: number;
  aprovadas: number;
  reprovadas: number;
  taxaAprovacao: number;
  tempoMedio: number;
}

export interface ProblemReport {
  item: string;
  totalReprovacoes: number;
  percentualReprovacao: number;
  marcasAfetadas: string[];
  exemplos: {
    vistoriaId: string;
    veiculo: string;
    placa: string;
    comentario: string;
  }[];
}

// Tipos de resposta das novas APIs
export interface DetailedInspectionsResponse {
  success: boolean;
  data: {
    periodo: {
      from: string;
      to: string;
    };
    total: number;
    vistorias: DetailedInspectionReport[];
  };
  message: string;
}

export interface DetailedInspectorsResponse {
  success: boolean;
  data: {
    total: number;
    inspetores: DetailedInspectorReport[];
  };
  message: string;
}

export interface BrandsReportResponse {
  success: boolean;
  data: {
    total: number;
    marcas: BrandReport[];
  };
  message: string;
}

export interface ProblemsReportResponse {
  success: boolean;
  data: {
    total: number;
    problemas: ProblemReport[];
  };
  message: string;
}

// Tipos de resposta da API
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos de erro
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
