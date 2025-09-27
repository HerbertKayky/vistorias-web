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
  ano: string;
  proprietario: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleRequest {
  nome: string;
  placa: string;
  modelo: string;
  marca: string;
  ano: string;
  proprietario: string;
}

// Tipos de inspeções/vistorias
export interface InspectionItem {
  id: string;
  name: string;
  status: 'approved' | 'rejected' | 'na';
}

export interface Inspection {
  id: string;
  vehicleId: string;
  vehicle: Vehicle;
  inspectorId: string;
  inspector: User;
  status: 'pending' | 'approved' | 'rejected';
  observations?: string;
  items: InspectionItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateInspectionRequest {
  vehicleId: string;
  observations?: string;
  items: {
    name: string;
    status: 'approved' | 'rejected' | 'na';
  }[];
}

export interface UpdateInspectionRequest {
  observations?: string;
  items: {
    name: string;
    status: 'approved' | 'rejected' | 'na';
  }[];
}

// Tipos de filtros
export interface InspectionFilters {
  status?: 'pending' | 'approved' | 'rejected';
  from?: string;
  to?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Tipos de relatórios
export interface ReportOverview {
  totalInspections: number;
  approvedInspections: number;
  rejectedInspections: number;
  pendingInspections: number;
  period: {
    from: string;
    to: string;
  };
}

export interface InspectorReport {
  inspectorId: string;
  inspectorName: string;
  totalInspections: number;
  approvedInspections: number;
  rejectedInspections: number;
  approvalRate: number;
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
