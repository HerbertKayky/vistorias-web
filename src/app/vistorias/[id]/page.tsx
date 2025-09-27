'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useInspection, useUpdateInspectionStatus } from '@/hooks/useApi';
import { 
  ArrowLeft, 
  Edit, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  User,
  Car
} from 'lucide-react';

const statusLabels = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Reprovado',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

const itemStatusLabels = {
  approved: 'Aprovado',
  rejected: 'Reprovado',
  na: 'N/A',
};

const itemStatusColors = {
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  na: 'bg-gray-100 text-gray-800',
};

const itemStatusIcons = {
  approved: CheckCircle,
  rejected: XCircle,
  na: Clock,
};

export default function VistoriaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const inspectionId = params.id as string;

  const { data: inspection, isLoading, error } = useInspection(inspectionId);
  const updateStatusMutation = useUpdateInspectionStatus();

  const handleStatusChange = async (status: 'pending' | 'approved' | 'rejected') => {
    try {
      await updateStatusMutation.mutateAsync({ id: inspectionId, status });
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
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
              <h1 className="text-2xl font-bold text-gray-900">Vistoria #{inspection.id.slice(-8)}</h1>
              <p className="text-gray-600">Detalhes da inspeção veicular</p>
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
                  <p className={`text-lg font-bold ${statusColors[inspection.status]}`}>
                    {statusLabels[inspection.status]}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">Data</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(inspection.createdAt).toLocaleDateString('pt-BR')}
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
                <p className="font-medium">{inspection.vehicle.nome || '-'}</p>
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
                <p className="font-medium">{inspection.vehicle.proprietario || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checklist */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Checklist de Vistoria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inspection.items.map((item, index) => {
                const ItemIcon = itemStatusIcons[item.status];
                return (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${itemStatusColors[item.status]}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.name}</span>
                      <div className="flex items-center">
                        <ItemIcon className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">
                          {itemStatusLabels[item.status]}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        {inspection.observations && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Observações</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{inspection.observations}</p>
            </CardContent>
          </Card>
        )}

        {/* Ações de Status */}
        {inspection.status === 'pending' && (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Alterar Status</h3>
              <div className="flex space-x-4">
                <Button
                  onClick={() => handleStatusChange('approved')}
                  loading={updateStatusMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprovar Vistoria
                </Button>
                <Button
                  onClick={() => handleStatusChange('rejected')}
                  loading={updateStatusMutation.isPending}
                  variant="danger"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reprovar Vistoria
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
