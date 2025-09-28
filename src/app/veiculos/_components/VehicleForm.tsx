import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Vehicle } from "@/types";

interface VehicleFormProps {
  showForm: boolean;
  editingVehicle: Vehicle | null;
  formData: {
    nome: string;
    placa: string;
    modelo: string;
    marca: string;
    ano: string;
    proprietario: string;
  };
  onFormDataChange: (data: {
    nome: string;
    placa: string;
    modelo: string;
    marca: string;
    ano: string;
    proprietario: string;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function VehicleForm({
  showForm,
  editingVehicle,
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  isLoading,
}: VehicleFormProps) {
  if (!showForm) return null;

  const handleInputChange = (field: string, value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {editingVehicle ? "Editar Veículo" : "Novo Veículo"}
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome do Veículo"
              value={formData.nome}
              onChange={(e) => handleInputChange("nome", e.target.value)}
              placeholder="Civic Branco"
              required
            />
            <Input
              label="Proprietário"
              value={formData.proprietario}
              onChange={(e) =>
                handleInputChange("proprietario", e.target.value)
              }
              placeholder="João Proprietário"
              required
            />
            <Input
              label="Placa"
              value={formData.placa}
              onChange={(e) =>
                handleInputChange("placa", e.target.value.toUpperCase())
              }
              placeholder="ABC-1234"
              required
            />
            <Input
              label="Marca"
              value={formData.marca}
              onChange={(e) => handleInputChange("marca", e.target.value)}
              placeholder="Toyota"
              required
            />
            <Input
              label="Modelo"
              value={formData.modelo}
              onChange={(e) => handleInputChange("modelo", e.target.value)}
              placeholder="Corolla"
              required
            />
            <Input
              label="Ano"
              type="number"
              value={formData.ano}
              onChange={(e) => handleInputChange("ano", e.target.value)}
              placeholder="2024"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              {editingVehicle ? "Atualizar" : "Salvar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
