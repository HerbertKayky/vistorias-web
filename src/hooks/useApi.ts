"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { httpClient } from "@/http";
import {
  LoginRequest,
  RegisterRequest,
  User,
  InspectionFilters,
  CreateInspectionRequest,
  UpdateInspectionRequest,
  CreateVehicleRequest,
  Vehicle,
  VehicleWithVistorias,
  ReportOverview,
  InspectorReport,
  Vistoria,
  DetailedInspectionsResponse,
  DetailedInspectorsResponse,
  BrandsReportResponse,
  ProblemsReportResponse,
} from "@/types";

// Tipo para erros de API
export interface ErrorWithResponse extends Error {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
}

// Hook para autenticação
export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isAuthenticated = httpClient.isAuthenticated();

  // Carregar perfil do usuário
  useEffect(() => {
    if (isAuthenticated && !user) {
      setIsLoading(true);
      httpClient
        .getProfile()
        .then(setUser)
        .catch(() => {
          // Se falhar ao carregar perfil, limpar tokens
          httpClient.logout();
        })
        .finally(() => setIsLoading(false));
    }
  }, [isAuthenticated, user]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setIsLoggingIn(true);
      try {
        await httpClient.login(credentials);
        const profile = await httpClient.getProfile();
        setUser(profile);
        router.push("/vistorias");
      } catch (error) {
        throw error;
      } finally {
        setIsLoggingIn(false);
      }
    },
    [router]
  );

  const register = useCallback(
    async (userData: RegisterRequest) => {
      setIsRegistering(true);
      try {
        await httpClient.register(userData);
        router.push("/login?registered=true");
      } catch (error) {
        throw error;
      } finally {
        setIsRegistering(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await httpClient.logout();
      setUser(null);
      router.push("/login");
    } catch (error) {
      throw error;
    } finally {
      setIsLoggingOut(false);
    }
  }, [router]);

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    isLoggingIn,
    isRegistering,
    isLoggingOut,
    isAuthenticated,
  };
}

// Hook para veículos
export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await httpClient.getVehicles();
      setVehicles(data);
    } catch (err) {
      const error = err as ErrorWithResponse;
      setError(error.message || "Erro ao carregar veículos");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return { data: vehicles, isLoading, error, refetch: fetchVehicles };
}

export function useVehicle(id: string) {
  const [vehicle, setVehicle] = useState<VehicleWithVistorias | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    setError(null);
    httpClient
      .getVehicle(id)
      .then(setVehicle)
      .catch((err: ErrorWithResponse) =>
        setError(err.message || "Erro ao carregar veículo")
      )
      .finally(() => setIsLoading(false));
  }, [id]);

  return { data: vehicle, isLoading, error };
}

export function useCreateVehicle() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutateAsync = useCallback(async (vehicle: CreateVehicleRequest) => {
    setIsPending(true);
    setError(null);
    try {
      const result = await httpClient.createVehicle(vehicle);
      return result;
    } catch (err) {
      const error = err as ErrorWithResponse;
      setError(error.message || "Erro ao criar veículo");
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { mutateAsync, isPending, error };
}

export function useUpdateVehicle() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutateAsync = useCallback(
    async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateVehicleRequest>;
    }) => {
      setIsPending(true);
      setError(null);
      try {
        const result = await httpClient.updateVehicle(id, data);
        return result;
      } catch (err) {
        const error = err as ErrorWithResponse;
        setError(error.message || "Erro ao atualizar veículo");
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    []
  );

  return { mutateAsync, isPending, error };
}

export function useDeleteVehicle() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutateAsync = useCallback(async (id: string) => {
    setIsPending(true);
    setError(null);
    try {
      await httpClient.deleteVehicle(id);
    } catch (err) {
      const error = err as ErrorWithResponse;
      setError(error.message || "Erro ao excluir veículo");
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { mutateAsync, isPending, error };
}

// Hook para inspeções
export function useInspections(filters?: InspectionFilters) {
  const [inspections, setInspections] = useState<Vistoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInspections = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await httpClient.getInspections(filters);
      if (Array.isArray(data)) {
        setInspections(data as Vistoria[]);
      } else if (
        data &&
        typeof data === "object" &&
        "data" in data &&
        Array.isArray((data as { data?: Vistoria[] }).data)
      ) {
        setInspections((data as { data?: Vistoria[] }).data || []);
      } else {
        setInspections([]);
      }
    } catch (err) {
      const error = err as ErrorWithResponse;
      setError(error.message || "Erro ao carregar vistorias");
    } finally {
      setIsLoading(false);
    }
  }, [
    filters?.status,
    filters?.search,
    filters?.inspectorId,
    filters?.from,
    filters?.to,
  ]);

  useEffect(() => {
    fetchInspections();
  }, [fetchInspections]);

  return { data: inspections, isLoading, error, refetch: fetchInspections };
}

export function useInspection(id: string) {
  const [inspection, setInspection] = useState<Vistoria | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    setError(null);
    httpClient
      .getInspection(id)
      .then(setInspection)
      .catch((err: ErrorWithResponse) =>
        setError(err.message || "Erro ao carregar vistoria")
      )
      .finally(() => setIsLoading(false));
  }, [id]);

  return { data: inspection, isLoading, error };
}

export function useCreateInspection() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutateAsync = useCallback(
    async (inspection: CreateInspectionRequest) => {
      setIsPending(true);
      setError(null);
      try {
        const result = await httpClient.createInspection(inspection);
        return result;
      } catch (err) {
        const error = err as ErrorWithResponse;
        setError(error.message || "Erro ao criar vistoria");
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    []
  );

  return { mutateAsync, isPending, error };
}

export function useUpdateInspection() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutateAsync = useCallback(
    async ({ id, data }: { id: string; data: UpdateInspectionRequest }) => {
      setIsPending(true);
      setError(null);
      try {
        const result = await httpClient.updateInspection(id, data);
        return result;
      } catch (err) {
        const error = err as ErrorWithResponse;
        setError(error.message || "Erro ao atualizar vistoria");
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    []
  );

  return { mutateAsync, isPending, error };
}

export function useUpdateInspectionStatus() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutateAsync = useCallback(
    async ({
      id,
      status,
    }: {
      id: string;
      status:
        | "PENDENTE"
        | "EM_ANDAMENTO"
        | "APROVADA"
        | "REPROVADA"
        | "CANCELADA";
    }) => {
      setIsPending(true);
      setError(null);
      try {
        console.log("Tentando atualizar status:", { id, status });
        const result = await httpClient.updateInspectionStatus(id, status);
        console.log("Status atualizado com sucesso:", result);
        return result;
      } catch (err) {
        const error = err as ErrorWithResponse;
        console.error("Erro detalhado:", error);
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);

        let errorMessage = "Erro ao atualizar status da vistoria";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }

        setError(errorMessage);
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    []
  );

  return { mutateAsync, isPending, error };
}

export function useDeleteInspection() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutateAsync = useCallback(async (id: string) => {
    setIsPending(true);
    setError(null);
    try {
      await httpClient.deleteInspection(id);
    } catch (err) {
      const error = err as ErrorWithResponse;
      setError(error.message || "Erro ao excluir vistoria");
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { mutateAsync, isPending, error };
}

// Hook para relatórios
export function useReportOverview(from: string, to: string) {
  const [data, setData] = useState<ReportOverview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!from || !to) return;

    setIsLoading(true);
    setError(null);
    httpClient
      .getReportOverview(from, to)
      .then(setData)
      .catch((err: ErrorWithResponse) =>
        setError(err.message || "Erro ao carregar relatório")
      )
      .finally(() => setIsLoading(false));
  }, [from, to]);

  return { data, isLoading, error };
}

export function useInspectorReports() {
  const [data, setData] = useState<InspectorReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await httpClient.getInspectorReports();
      setData(result);
    } catch (err) {
      const error = err as ErrorWithResponse;
      setError(error.message || "Erro ao carregar relatórios");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { data, isLoading, error, refetch: fetchReports };
}

// Novos hooks para relatórios detalhados
export function useDetailedInspections(from?: string, to?: string) {
  const [data, setData] = useState<DetailedInspectionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await httpClient.getDetailedInspections(from, to);
      setData(result);
    } catch (err) {
      const error = err as ErrorWithResponse;
      setError(error.message || "Erro ao carregar vistorias detalhadas");
    } finally {
      setIsLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

export function useDetailedInspectors() {
  const [data, setData] = useState<DetailedInspectorsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await httpClient.getDetailedInspectors();
      setData(result);
    } catch (err) {
      const error = err as ErrorWithResponse;
      setError(error.message || "Erro ao carregar inspetores detalhados");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

export function useBrandsReport() {
  const [data, setData] = useState<BrandsReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await httpClient.getBrandsReport();
      setData(result);
    } catch (err) {
      const error = err as ErrorWithResponse;
      setError(error.message || "Erro ao carregar relatório de marcas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

export function useProblemsReport() {
  const [data, setData] = useState<ProblemsReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await httpClient.getProblemsReport();
      setData(result);
    } catch (err) {
      const error = err as ErrorWithResponse;
      setError(error.message || "Erro ao carregar relatório de problemas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
