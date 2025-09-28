"use client";

import { useState } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useInspections } from "@/hooks/useApi";
import {
  Search,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  Car,
  Filter,
} from "lucide-react";

const statusLabels = {
  PENDENTE: "Pendente",
  EM_ANDAMENTO: "Em Andamento",
  APROVADA: "Aprovada",
  REPROVADA: "Reprovada",
  CANCELADA: "Cancelada",
};

const statusColors = {
  PENDENTE: "bg-yellow-100 text-yellow-800",
  EM_ANDAMENTO: "bg-blue-100 text-blue-800",
  APROVADA: "bg-green-100 text-green-800",
  REPROVADA: "bg-red-100 text-red-800",
  CANCELADA: "bg-gray-100 text-gray-800",
};

const statusIcons = {
  PENDENTE: Clock,
  EM_ANDAMENTO: Clock,
  APROVADA: CheckCircle,
  REPROVADA: XCircle,
  CANCELADA: XCircle,
};

export default function VistoriasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const {
    data: inspections,
    isLoading,
    error,
    refetch,
  } = useInspections({
    search: searchTerm || undefined,
    status: statusFilter
      ? (statusFilter as
          | "PENDENTE"
          | "EM_ANDAMENTO"
          | "APROVADA"
          | "REPROVADA"
          | "CANCELADA")
      : undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Erro ao carregar vistorias: {error}</p>
          <Button onClick={() => refetch()} className="mt-4">
            Tentar Novamente
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vistorias</h1>
          <p className="text-gray-600">
            Gerencie todas as vistorias de veículos
          </p>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por título, placa ou inspetor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Buscar</Button>
              </form>

              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos os Status</option>
                  <option value="PENDENTE">Pendente</option>
                  <option value="EM_ANDAMENTO">Em Andamento</option>
                  <option value="APROVADA">Aprovada</option>
                  <option value="REPROVADA">Reprovada</option>
                  <option value="CANCELADA">Cancelada</option>
                </select>

                {(searchTerm || statusFilter) && (
                  <Button variant="outline" onClick={clearFilters}>
                    <Filter className="h-4 w-4 mr-2" />
                    Limpar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Vistorias */}
        {inspections && inspections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inspections.map((inspection) => {
              const StatusIcon = statusIcons[inspection.status];

              return (
                <Card
                  key={inspection.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {inspection.titulo}
                        </h3>
                        <p className="text-sm text-gray-600">
                          #{inspection.id.slice(-8)}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[inspection.status]
                        }`}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusLabels[inspection.status]}
                      </span>
                    </div>

                    {/* Informações do Veículo */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Car className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">
                          {inspection.vehicle.placa}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {inspection.vehicle.marca} {inspection.vehicle.modelo} (
                        {inspection.vehicle.ano})
                      </p>
                    </div>

                    {/* Informações do Inspetor */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-1">
                        <User className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">
                          Inspetor
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {inspection.inspector.name}
                      </p>
                    </div>

                    {/* Data */}
                    <div className="mb-4 flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        Criada em{" "}
                        {new Date(inspection.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </span>
                    </div>

                    {/* Descrição */}
                    {inspection.descricao && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {inspection.descricao}
                      </p>
                    )}

                    {/* Ações */}
                    <div className="flex gap-2">
                      <Link
                        href={`/vistorias/${inspection.id}`}
                        className="flex-1"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </Link>
                      <Link href={`/vistorias/${inspection.id}/edit`}>
                        <Button size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Car className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma vistoria encontrada
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter
                  ? "Tente ajustar os filtros de busca"
                  : "Comece criando sua primeira vistoria"}
              </p>
              <Link href="/vistorias/new">
                <Button>Nova Vistoria</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
