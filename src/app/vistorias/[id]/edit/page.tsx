"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Input";
import { InspectionChecklist } from "@/components/vistoria/InspectionChecklist";
import {
  ErrorWithResponse,
  useInspection,
  useUpdateInspection,
} from "@/hooks/useApi";
import { ArrowLeft, Save } from "lucide-react";

interface ChecklistItem {
  key: string;
  status: "APROVADO" | "REPROVADO" | "NAO_APLICAVEL";
  comment?: string;
}

export default function EditVistoriaPage() {
  const params = useParams();
  const router = useRouter();
  const inspectionId = params.id as string;

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    observacoes: "",
  });
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [error, setError] = useState("");

  const {
    data: inspection,
    isLoading,
    error: inspectionError,
  } = useInspection(inspectionId);
  const updateInspectionMutation = useUpdateInspection();

  useEffect(() => {
    if (inspection) {
      setFormData({
        titulo: inspection.titulo || "",
        descricao: inspection.descricao || "",
        observacoes: inspection.observacoes || "",
      });

      // Converter checklistItems do formato do backend para o formato do frontend
      const convertedItems = inspection.checklistItems.map((item) => ({
        key: item.key,
        status: item.status,
        comment: item.comment,
      }));
      setChecklistItems(convertedItems);
    }
  }, [inspection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.titulo.trim()) {
      setError("O título é obrigatório");
      return;
    }

    if (checklistItems.length === 0) {
      setError("Preencha pelo menos um item do checklist");
      return;
    }

    try {
      await updateInspectionMutation.mutateAsync({
        id: inspectionId,
        data: {
          titulo: formData.titulo,
          descricao: formData.descricao || undefined,
          observacoes: formData.observacoes || undefined,
          items: checklistItems,
        },
      });
      router.push(`/vistorias/${inspectionId}`);
    } catch (err) {
      const error = err as ErrorWithResponse;
      setError(error.response?.data?.message || "Erro ao atualizar vistoria");
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

  if (inspectionError || !inspection) {
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

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href={`/vistorias/${inspectionId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Editar Vistoria
            </h1>
            <p className="text-gray-600">
              Modificar dados da inspeção veicular
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas da Vistoria */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Informações da Vistoria
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Título da Vistoria"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, titulo: e.target.value }))
                  }
                  placeholder="Ex: Vistoria Completa de Segurança Veicular"
                  required
                />
                <Textarea
                  label="Descrição"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      descricao: e.target.value,
                    }))
                  }
                  placeholder="Descrição detalhada da vistoria..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informações do Veículo (somente leitura) */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Informações do Veículo
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-gray-600">Nome:</span>
                  <p className="font-medium">
                    {inspection.vehicle.nome || "-"}
                  </p>
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
          <InspectionChecklist
            items={checklistItems}
            onChange={setChecklistItems}
          />

          {/* Observações */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Observações
              </h3>
              <Textarea
                label="Observações finais"
                value={formData.observacoes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    observacoes: e.target.value,
                  }))
                }
                placeholder="Digite observações finais sobre a vistoria..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end space-x-4">
            <Link href={`/vistorias/${inspectionId}`}>
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button
              type="submit"
              loading={updateInspectionMutation.isPending}
              disabled={updateInspectionMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
