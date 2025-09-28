import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

interface VehiclesFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  vistoriasFilter: "all" | "with" | "without";
  onVistoriasFilterChange: (filter: "all" | "with" | "without") => void;
}

export function VehiclesFilters({
  searchTerm,
  onSearchChange,
  vistoriasFilter,
  onVistoriasFilterChange,
}: VehiclesFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <Input
            label="Buscar veículos"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Nome, placa, marca, modelo ou proprietário..."
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Vistorias
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="vistoriasFilter"
                  value="all"
                  checked={vistoriasFilter === "all"}
                  onChange={(e) =>
                    onVistoriasFilterChange(
                      e.target.value as "all" | "with" | "without"
                    )
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Todos</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="vistoriasFilter"
                  value="with"
                  checked={vistoriasFilter === "with"}
                  onChange={(e) =>
                    onVistoriasFilterChange(
                      e.target.value as "all" | "with" | "without"
                    )
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Com Vistorias</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="vistoriasFilter"
                  value="without"
                  checked={vistoriasFilter === "without"}
                  onChange={(e) =>
                    onVistoriasFilterChange(
                      e.target.value as "all" | "with" | "without"
                    )
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Sem Vistorias</span>
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
