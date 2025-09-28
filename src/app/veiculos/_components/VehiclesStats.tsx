import { Card, CardContent } from "@/components/ui/Card";
import { Car, Calendar, Hash, Eye } from "lucide-react";
import { Vehicle } from "@/types";

interface VehiclesStatsProps {
  vehicles: Vehicle[] | null;
  filteredVehicles: Vehicle[] | null;
}

export function VehiclesStats({
  vehicles,
  filteredVehicles,
}: VehiclesStatsProps) {
  const recentVehicles =
    vehicles?.filter((v) => {
      const createdDate = new Date(v.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate > thirtyDaysAgo;
    }).length || 0;

  const uniqueBrands = new Set(vehicles?.map((v) => v.marca)).size || 0;

  const totalVistorias =
    filteredVehicles?.reduce(
      (total, v) => total + (v._count?.vistorias || 0),
      0
    ) || 0;

  const vehiclesWithVistorias =
    filteredVehicles?.filter((v) => (v._count?.vistorias || 0) > 0).length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">
                Total de Veículos
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {vehicles?.length || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">
                Veículos Recentes
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {recentVehicles}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Hash className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Marcas Únicas</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueBrands}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Eye className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">
                Total de Vistorias
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalVistorias}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Eye className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Com Vistorias</p>
              <p className="text-2xl font-bold text-gray-900">
                {vehiclesWithVistorias}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
