import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";
import { VehicleWithVistorias, Vehicle } from "@/types";

interface VistoriasModalProps {
  show: boolean;
  selectedVehicle: Vehicle | null;
  vehicleDetails: VehicleWithVistorias | null;
  onClose: () => void;
}

export function VistoriasModal({
  show,
  selectedVehicle,
  vehicleDetails,
  onClose,
}: VistoriasModalProps) {
  if (!show || !selectedVehicle) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APROVADA":
        return "text-green-600 bg-green-100";
      case "REPROVADA":
        return "text-red-600 bg-red-100";
      case "EM_ANDAMENTO":
        return "text-yellow-600 bg-yellow-100";
      case "PENDENTE":
        return "text-blue-600 bg-blue-100";
      case "CANCELADA":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Vistorias do Veículo:{" "}
            {vehicleDetails?.nome ||
              vehicleDetails?.placa ||
              selectedVehicle?.nome ||
              selectedVehicle?.placa}
          </h3>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {vehicleDetails?.vistorias && vehicleDetails.vistorias.length > 0 ? (
            vehicleDetails.vistorias.map((vistoria) => (
              <Card key={vistoria.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {vistoria.titulo}
                      </h4>
                      {vistoria.descricao && (
                        <p className="text-sm text-gray-600 mt-1">
                          {vistoria.descricao}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        vistoria.status
                      )}`}
                    >
                      {vistoria.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Data de Início:</span>
                      <br />
                      {new Date(vistoria.dataInicio).toLocaleDateString(
                        "pt-BR"
                      )}
                    </div>
                    {vistoria.dataFim && (
                      <div>
                        <span className="font-medium">Data de Fim:</span>
                        <br />
                        {new Date(vistoria.dataFim).toLocaleDateString("pt-BR")}
                      </div>
                    )}
                    {vistoria.inspector && (
                      <div>
                        <span className="font-medium">Inspetor:</span>
                        <br />
                        {vistoria.inspector.name}
                      </div>
                    )}
                    {vistoria.tempoGasto && (
                      <div>
                        <span className="font-medium">Tempo Gasto:</span>
                        <br />
                        {vistoria.tempoGasto} minutos
                      </div>
                    )}
                  </div>

                  {vistoria.observacoes && (
                    <div className="mt-3">
                      <span className="font-medium text-sm text-gray-700">
                        Observações:
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        {vistoria.observacoes}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex justify-end">
                    <Link href={`/vistorias/${vistoria.id}`}>
                      <Button size="sm" variant="outline">
                        Ver Detalhes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                Nenhuma vistoria encontrada para este veículo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
