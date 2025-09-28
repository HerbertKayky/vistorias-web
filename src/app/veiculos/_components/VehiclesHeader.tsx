import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

interface VehiclesHeaderProps {
  onNewVehicle: () => void;
}

export function VehiclesHeader({ onNewVehicle }: VehiclesHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Veículos</h1>
        <p className="text-gray-600">Gerencie a frota de veículos</p>
      </div>
      <Button onClick={onNewVehicle}>
        <Plus className="h-4 w-4 mr-2" />
        Novo Veículo
      </Button>
    </div>
  );
}
