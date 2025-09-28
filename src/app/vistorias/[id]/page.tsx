"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  ErrorWithResponse,
  useInspection,
  useUpdateInspectionStatus,
} from "@/hooks/useApi";
import {
  ArrowLeft,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  Car,
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

const itemStatusLabels = {
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
  NAO_APLICAVEL: "N/A",
};

const itemStatusColors = {
  APROVADO: "bg-green-100 text-green-800",
  REPROVADO: "bg-red-100 text-red-800",
  NAO_APLICAVEL: "bg-gray-100 text-gray-800",
};

const itemStatusIcons = {
  APROVADO: CheckCircle,
  REPROVADO: XCircle,
  NAO_APLICAVEL: Clock,
};

export default function VistoriaDetailPage() {
  const params = useParams();
  const inspectionId = params.id as string;

  const { data: inspection, isLoading, error } = useInspection(inspectionId);
  const updateStatusMutation = useUpdateInspectionStatus();

  const handleStatusChange = async (
    status: "PENDENTE" | "EM_ANDAMENTO" | "APROVADA" | "REPROVADA" | "CANCELADA"
  ) => {
    try {
      await updateStatusMutation.mutateAsync({ id: inspectionId, status });
      // Recarregar a página para mostrar o novo status
      window.location.reload();
    } catch (err) {
      const error = err as ErrorWithResponse;
      console.error("Erro ao atualizar status:", error);
      // O erro será exibido automaticamente pelo componente devido ao updateStatusMutation.error
    }
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

  if (error || !inspection) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-red-600">Erro ao carregar vistoria</p>
          <Link href="/vistorias">
            <Button className="mt-4">Voltar para Vistorias</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const StatusIcon = statusIcons[inspection.status];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/vistorias">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {inspection.titulo}
              </h1>
              <p className="text-gray-600">#{inspection.id.slice(-8)}</p>
            </div>
          </div>
          <Link href={`/vistorias/${inspection.id}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
        </div>

        {/* Status e Informações Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <StatusIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                      statusColors[inspection.status]
                    }`}
                  >
                    {statusLabels[inspection.status]}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">
                    Data de Criação
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(inspection.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Inspetor</p>
                  <p className="text-lg font-bold text-gray-900">
                    {inspection.inspector.name}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Descrição */}
        {inspection.descricao && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Descrição
              </h3>
              <p className="text-gray-700">{inspection.descricao}</p>
            </CardContent>
          </Card>
        )}

        {/* Informações do Veículo */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Car className="h-5 w-5 mr-2" />
              Informações do Veículo
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-gray-600">Nome:</span>
                <p className="font-medium">{inspection.vehicle.nome || "-"}</p>
              </div>
              <div>
                <span className="text-gray-600">Placa:</span>
                <p className="font-medium">{inspection.vehicle.placa}</p>
              </div>
              <div>
                <span className="text-gray-600">Marca:</span>
                <p className="font-medium">{inspection.vehicle.marca}</p>
              </div>
              <div>
                <span className="text-gray-600">Modelo:</span>
                <p className="font-medium">{inspection.vehicle.modelo}</p>
              </div>
              <div>
                <span className="text-gray-600">Ano:</span>
                <p className="font-medium">{inspection.vehicle.ano}</p>
              </div>
              <div>
                <span className="text-gray-600">Proprietário:</span>
                <p className="font-medium">
                  {inspection.vehicle.proprietario || "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checklist */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Checklist de Vistoria
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inspection.checklistItems.map((item, index) => {
                const ItemIcon = itemStatusIcons[item.status];
                return (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.key}</span>
                      <div className="flex items-center">
                        <ItemIcon className="h-4 w-4 mr-1" />
                        <span
                          className={`text-sm font-medium px-2 py-1 rounded-full ${
                            itemStatusColors[item.status]
                          }`}
                        >
                          {itemStatusLabels[item.status]}
                        </span>
                      </div>
                    </div>
                    {item.comment && (
                      <p className="text-sm text-gray-600 mt-2">
                        {item.comment}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        {inspection.observacoes && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Observações
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {inspection.observacoes}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Ações de Status */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Alterar Status
            </h3>
            <div className="flex flex-wrap gap-4">
              {inspection.status === "PENDENTE" && (
                <>
                  <Button
                    onClick={() => handleStatusChange("EM_ANDAMENTO")}
                    loading={updateStatusMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Iniciar Vistoria
                  </Button>
                  <Button
                    onClick={() => handleStatusChange("APROVADA")}
                    loading={updateStatusMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprovar Vistoria
                  </Button>
                  <Button
                    onClick={() => handleStatusChange("REPROVADA")}
                    loading={updateStatusMutation.isPending}
                    variant="danger"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reprovar Vistoria
                  </Button>
                </>
              )}

              {inspection.status === "EM_ANDAMENTO" && (
                <>
                  <Button
                    onClick={() => handleStatusChange("APROVADA")}
                    loading={updateStatusMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprovar Vistoria
                  </Button>
                  <Button
                    onClick={() => handleStatusChange("REPROVADA")}
                    loading={updateStatusMutation.isPending}
                    variant="danger"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reprovar Vistoria
                  </Button>
                  <Button
                    onClick={() => handleStatusChange("PENDENTE")}
                    loading={updateStatusMutation.isPending}
                    variant="outline"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Voltar para Pendente
                  </Button>
                </>
              )}

              {(inspection.status === "APROVADA" ||
                inspection.status === "REPROVADA") && (
                <Button
                  onClick={() => handleStatusChange("EM_ANDAMENTO")}
                  loading={updateStatusMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Reabrir Vistoria
                </Button>
              )}

              {inspection.status !== "CANCELADA" && (
                <Button
                  onClick={() => handleStatusChange("CANCELADA")}
                  loading={updateStatusMutation.isPending}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancelar Vistoria
                </Button>
              )}
            </div>

            {/* Exibir erro se houver */}
            {updateStatusMutation.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">
                  Erro ao atualizar status: {updateStatusMutation.error}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
