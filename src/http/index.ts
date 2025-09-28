import axios, { AxiosInstance, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  User,
  Vehicle,
  VehicleWithVistorias,
  CreateVehicleRequest,
  CreateInspectionRequest,
  UpdateInspectionRequest,
  InspectionFilters,
  ReportOverview,
  InspectorReport,
  Vistoria,
  DetailedInspectionsResponse,
  DetailedInspectorsResponse,
  BrandsReportResponse,
  ProblemsReportResponse,
} from "@/types";

class HttpClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
      headers: {
        "Content-Type": "application/json",
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
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes("/auth/")
        ) {
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
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Métodos de autenticação
  private getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return Cookies.get("accessToken") || null;
  }

  private getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return Cookies.get("refreshToken") || null;
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === "undefined") return;
    Cookies.set("accessToken", accessToken, { expires: 1 }); // 1 dia
    Cookies.set("refreshToken", refreshToken, { expires: 7 }); // 7 dias
  }

  private clearTokens(): void {
    if (typeof window === "undefined") return;
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  }

  // Métodos da API
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>(
      "/auth/login",
      credentials
    );
    this.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<{ message: string }> {
    const response = await this.api.post<{ message: string }>(
      "/auth/register",
      userData
    );
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  }

  async logout(): Promise<void> {
    this.clearTokens();
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get<User>("/profile");
    return response.data;
  }

  // Métodos de veículos
  async getVehicles(): Promise<Vehicle[]> {
    const response = await this.api.get<Vehicle[]>("/vehicles");
    return response.data;
  }

  async getVehicle(id: string): Promise<VehicleWithVistorias> {
    const response = await this.api.get<VehicleWithVistorias>(
      `/vehicles/${id}`
    );
    return response.data;
  }

  async getVehicleWithCount(id: string): Promise<Vehicle> {
    const response = await this.api.get<Vehicle>(`/vehicles/${id}/count`);
    return response.data;
  }

  async createVehicle(vehicle: CreateVehicleRequest): Promise<Vehicle> {
    const response = await this.api.post<Vehicle>("/vehicles", vehicle);
    return response.data;
  }

  async updateVehicle(
    id: string,
    vehicle: Partial<CreateVehicleRequest>
  ): Promise<Vehicle> {
    const response = await this.api.put<Vehicle>(`/vehicles/${id}`, vehicle);
    return response.data;
  }

  async deleteVehicle(id: string): Promise<void> {
    await this.api.delete(`/vehicles/${id}`);
  }

  // Métodos de inspeções
  async getInspections(filters?: InspectionFilters): Promise<Vistoria[]> {
    const params = new URLSearchParams();

    if (filters?.status) params.append("status", filters.status);
    if (filters?.inspectorId) params.append("inspectorId", filters.inspectorId);
    if (filters?.from) params.append("from", filters.from);
    if (filters?.to) params.append("to", filters.to);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await this.api.get<Vistoria[]>(
      `/inspections?${params.toString()}`
    );
    return response.data;
  }

  async getInspection(id: string): Promise<Vistoria> {
    const response = await this.api.get<Vistoria>(`/inspections/${id}`);
    return response.data;
  }

  async createInspection(
    inspection: CreateInspectionRequest
  ): Promise<Vistoria> {
    const response = await this.api.post<Vistoria>("/inspections", inspection);
    return response.data;
  }

  async updateInspection(
    id: string,
    inspection: UpdateInspectionRequest
  ): Promise<Vistoria> {
    const response = await this.api.put<Vistoria>(
      `/inspections/${id}`,
      inspection
    );
    return response.data;
  }

  async updateInspectionStatus(
    id: string,
    status: "PENDENTE" | "EM_ANDAMENTO" | "APROVADA" | "REPROVADA" | "CANCELADA"
  ): Promise<Vistoria> {
    console.log("Atualizando status da inspeção:", { id, status });

    // Usar o endpoint de atualização geral da inspeção
    const response = await this.api.patch<Vistoria>(
      `/inspections/${id}/status`,
      {
        status,
      }
    );
    return response.data;
  }

  async completeInspection(
    id: string,
    observacoes?: string
  ): Promise<Vistoria> {
    const response = await this.api.put<Vistoria>(
      `/inspections/${id}/complete`,
      { observacoes }
    );
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
    const response = await this.api.get<InspectorReport[]>(
      "/reports/by-inspector"
    );
    return response.data;
  }

  async exportInspectionsCSV(): Promise<Blob> {
    const response = await this.api.get("/reports/export/inspections", {
      responseType: "blob",
    });
    return response.data;
  }

  async exportInspectorsCSV(): Promise<Blob> {
    const response = await this.api.get("/reports/export/inspectors", {
      responseType: "blob",
    });
    return response.data;
  }

  // Novos métodos de relatórios detalhados
  async getDetailedInspections(
    from?: string,
    to?: string
  ): Promise<DetailedInspectionsResponse> {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);

    const response = await this.api.get<DetailedInspectionsResponse>(
      `/reports/export/inspections?${params.toString()}`
    );
    return response.data;
  }

  async getDetailedInspectors(): Promise<DetailedInspectorsResponse> {
    const response = await this.api.get<DetailedInspectorsResponse>(
      "/reports/export/inspectors"
    );
    return response.data;
  }

  async getBrandsReport(): Promise<BrandsReportResponse> {
    const response = await this.api.get<BrandsReportResponse>(
      "/reports/export/brands"
    );
    return response.data;
  }

  async getProblemsReport(): Promise<ProblemsReportResponse> {
    const response = await this.api.get<ProblemsReportResponse>(
      "/reports/export/problems"
    );
    return response.data;
  }

  // Método para verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// Instância singleton do cliente HTTP
export const httpClient = new HttpClient();
export default httpClient;
