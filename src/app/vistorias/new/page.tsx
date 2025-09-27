'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Input';
import { InspectionChecklist } from '@/components/vistoria/InspectionChecklist';
import { useVehicles, useCreateInspection } from '@/hooks/useApi';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface ChecklistItem {
  name: string;
  status: 'approved' | 'rejected' | 'na';
}

export default function NewVistoriaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    vehicleId: '',
    observations: '',
  });
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [error, setError] = useState('');

  const { data: vehicles, isLoading: vehiclesLoading } = useVehicles();
  const createInspectionMutation = useCreateInspection();

  const vehicleOptions = vehicles?.map(vehicle => ({
    value: vehicle.id,
    label: `${vehicle.nome || vehicle.placa} - ${vehicle.marca} ${vehicle.modelo} (${vehicle.ano}) - ${vehicle.proprietario || 'Sem proprietário'}`
  })) || [];

  const selectedVehicle = vehicles?.find(v => v.id === formData.vehicleId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.vehicleId) {
      setError('Selecione um veículo');
      return;
    }

    if (checklistItems.length === 0) {
      setError('Preencha pelo menos um item do checklist');
      return;
    }

    try {
      await createInspectionMutation.mutateAsync({
        vehicleId: formData.vehicleId,
        observations: formData.observations || undefined,
        items: checklistItems,
      });
      router.push('/vistorias');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar vistoria');
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/vistorias">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nova Vistoria</h1>
            <p className="text-gray-600">Criar uma nova inspeção veicular</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações do Veículo */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Veículo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Veículo"
                  value={formData.vehicleId}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleId: e.target.value }))}
                  options={vehicleOptions}
                  placeholder="Selecione um veículo"
                  required
                />
              </div>

              {selectedVehicle && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Dados do Veículo Selecionado</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Nome:</span>
                      <p className="font-medium">{selectedVehicle.nome || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Placa:</span>
                      <p className="font-medium">{selectedVehicle.placa}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Marca:</span>
                      <p className="font-medium">{selectedVehicle.marca}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Modelo:</span>
                      <p className="font-medium">{selectedVehicle.modelo}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Ano:</span>
                      <p className="font-medium">{selectedVehicle.ano}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Proprietário:</span>
                      <p className="font-medium">{selectedVehicle.proprietario || '-'}</p>
                    </div>
                  </div>
                </div>
              )}
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Observações</h3>
              <Textarea
                label="Observações adicionais"
                value={formData.observations}
                onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                placeholder="Digite observações sobre a vistoria..."
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
            <Link href="/vistorias">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button
              type="submit"
              loading={createInspectionMutation.isPending}
              disabled={createInspectionMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Vistoria
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
