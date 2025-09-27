import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  User,
  Vehicle,
  CreateVehicleRequest,
  Inspection,
  CreateInspectionRequest,
  UpdateInspectionRequest,
  InspectionFilters,
  ReportOverview,
  InspectorReport,
  PaginatedResponse,
  ApiError
} from '@/types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token de autenticação
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para lidar com respostas e erros
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Se o token expirou (401) e não é uma tentativa de refresh
        // E não é uma rota de autenticação
        if (error.response?.status === 401 && 
            !originalRequest._retry && 
            !originalRequest.url?.includes('/auth/')) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              this.setTokens(response.accessToken, response.refreshToken);
              
              // Repetir a requisição original com o novo token
              originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Se o refresh falhou, redirecionar para login
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Métodos de autenticação
  private getAccessToken(): string | null {
    return Cookies.get('accessToken') || null;
  }

  private getRefreshToken(): string | null {
    return Cookies.get('refreshToken') || null;
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    Cookies.set('accessToken', accessToken, { expires: 1 }); // 1 dia
    Cookies.set('refreshToken', refreshToken, { expires: 7 }); // 7 dias
  }

  private clearTokens(): void {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  }

  // Métodos da API
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>('/auth/login', credentials);
    this.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<{ message: string }> {
    const response = await this.api.post<{ message: string }>('/auth/register', userData);
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>('/auth/refresh', {
      refreshToken
    });
    return response.data;
  }

  async logout(): Promise<void> {
    this.clearTokens();
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get<User>('/profile');
    return response.data;
  }

  // Métodos de veículos
  async getVehicles(): Promise<Vehicle[]> {
    const response = await this.api.get<Vehicle[]>('/vehicles');
    return response.data;
  }

  async getVehicle(id: string): Promise<Vehicle> {
    const response = await this.api.get<Vehicle>(`/vehicles/${id}`);
    return response.data;
  }

  async createVehicle(vehicle: CreateVehicleRequest): Promise<Vehicle> {
    const response = await this.api.post<Vehicle>('/vehicles', vehicle);
    return response.data;
  }

  async updateVehicle(id: string, vehicle: Partial<CreateVehicleRequest>): Promise<Vehicle> {
    const response = await this.api.put<Vehicle>(`/vehicles/${id}`, vehicle);
    return response.data;
  }

  async deleteVehicle(id: string): Promise<void> {
    await this.api.delete(`/vehicles/${id}`);
  }

  // Métodos de inspeções
  async getInspections(filters?: InspectionFilters): Promise<PaginatedResponse<Inspection>> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.from) params.append('from', filters.from);
    if (filters?.to) params.append('to', filters.to);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await this.api.get<PaginatedResponse<Inspection>>(
      `/inspections?${params.toString()}`
    );
    return response.data;
  }

  async getInspection(id: string): Promise<Inspection> {
    const response = await this.api.get<Inspection>(`/inspections/${id}`);
    return response.data;
  }

  async createInspection(inspection: CreateInspectionRequest): Promise<Inspection> {
    const response = await this.api.post<Inspection>('/inspections', inspection);
    return response.data;
  }

  async updateInspection(id: string, inspection: UpdateInspectionRequest): Promise<Inspection> {
    const response = await this.api.put<Inspection>(`/inspections/${id}`, inspection);
    return response.data;
  }

  async updateInspectionStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Inspection> {
    const response = await this.api.patch<Inspection>(`/inspections/${id}/status`, { status });
    return response.data;
  }

  async deleteInspection(id: string): Promise<void> {
    await this.api.delete(`/inspections/${id}`);
  }

  // Métodos de relatórios
  async getReportOverview(from: string, to: string): Promise<ReportOverview> {
    const response = await this.api.get<ReportOverview>(
      `/reports/overview?from=${from}&to=${to}`
    );
    return response.data;
  }

  async getInspectorReports(): Promise<InspectorReport[]> {
    const response = await this.api.get<InspectorReport[]>('/reports/by-inspector');
    return response.data;
  }

  async exportInspectionsCSV(): Promise<Blob> {
    const response = await this.api.get('/reports/export/inspections', {
      responseType: 'blob'
    });
    return response.data;
  }

  async exportInspectorsCSV(): Promise<Blob> {
    const response = await this.api.get('/reports/export/inspectors', {
      responseType: 'blob'
    });
    return response.data;
  }

  // Método para verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// Instância singleton do serviço
export const apiService = new ApiService();
export default apiService;
