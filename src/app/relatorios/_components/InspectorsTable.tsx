import { Card, CardContent } from "@/components/ui/Card";
import { Users, TrendingUp, Clock } from "lucide-react";
import { InspectorReport } from "@/types";

interface InspectorsTableProps {
  inspectorReports: InspectorReport[] | null;
  isLoading: boolean;
}

export function InspectorsTable({
  inspectorReports,
  isLoading,
}: InspectorsTableProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Métricas por Inspetor
        </h3>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando dados...</p>
          </div>
        ) : inspectorReports && inspectorReports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inspetor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total de Vistorias
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aprovadas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reprovadas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taxa de Aprovação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tempo Médio
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inspectorReports.map((report) => (
                  <tr key={report.inspectorId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {report.inspectorName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.totalInspections}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="text-green-600 font-medium">
                        {report.approvedInspections}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="text-red-600 font-medium">
                        {report.rejectedInspections}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
                        <span className="font-medium">
                          {(() => {
                            // Calcular taxa de aprovação se não estiver disponível
                            if (report.approvalRate !== undefined) {
                              return `${report.approvalRate.toFixed(1)}%`;
                            }
                            // Calcular baseado nos dados disponíveis
                            const total = report.totalInspections;
                            const rate =
                              total > 0
                                ? (report.approvedInspections / total) * 100
                                : 0;
                            return `${rate.toFixed(1)}%`;
                          })()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-600 mr-1" />
                        <span className="font-medium">
                          {report.averageTimeSpent
                            ? `${report.averageTimeSpent.toFixed(0)} min`
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Nenhum dado de inspetor encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
