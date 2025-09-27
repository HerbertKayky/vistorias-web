'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api';
import { LoginRequest, RegisterRequest, User, InspectionFilters, CreateInspectionRequest, UpdateInspectionRequest, CreateVehicleRequest } from '@/types';

// Hook para autenticação
export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: user, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => apiService.getProfile(),
    enabled: apiService.isAuthenticated(),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => apiService.login(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      router.push('/vistorias');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => apiService.register(userData),
    onSuccess: () => {
      // Redirecionar para login com parâmetro de sucesso
      router.push('/login?registered=true');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiService.logout(),
    onSuccess: () => {
      queryClient.clear();
      router.push('/login');
    },
  });

  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isAuthenticated: apiService.isAuthenticated(),
  };
}

// Hook para veículos
export function useVehicles() {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: () => apiService.getVehicles(),
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => apiService.getVehicle(id),
    enabled: !!id,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (vehicle: CreateVehicleRequest) => apiService.createVehicle(vehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateVehicleRequest> }) =>
      apiService.updateVehicle(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', id] });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}

// Hook para inspeções
export function useInspections(filters?: InspectionFilters) {
  return useQuery({
    queryKey: ['inspections', filters],
    queryFn: () => apiService.getInspections(filters),
  });
}

export function useInspection(id: string) {
  return useQuery({
    queryKey: ['inspection', id],
    queryFn: () => apiService.getInspection(id),
    enabled: !!id,
  });
}

export function useCreateInspection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (inspection: CreateInspectionRequest) => apiService.createInspection(inspection),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspections'] });
    },
  });
}

export function useUpdateInspection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInspectionRequest }) =>
      apiService.updateInspection(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['inspections'] });
      queryClient.invalidateQueries({ queryKey: ['inspection', id] });
    },
  });
}

export function useUpdateInspectionStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pending' | 'approved' | 'rejected' }) =>
      apiService.updateInspectionStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['inspections'] });
      queryClient.invalidateQueries({ queryKey: ['inspection', id] });
    },
  });
}

export function useDeleteInspection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.deleteInspection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspections'] });
    },
  });
}

// Hook para relatórios
export function useReportOverview(from: string, to: string) {
  return useQuery({
    queryKey: ['report-overview', from, to],
    queryFn: () => apiService.getReportOverview(from, to),
    enabled: !!from && !!to,
  });
}

export function useInspectorReports() {
  return useQuery({
    queryKey: ['inspector-reports'],
    queryFn: () => apiService.getInspectorReports(),
  });
}
