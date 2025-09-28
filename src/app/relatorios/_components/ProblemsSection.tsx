import { Card, CardContent } from "@/components/ui/Card";
import { AlertTriangle } from "lucide-react";
import { ProblemsReportResponse } from "@/types";

interface ProblemsSectionProps {
  problemsReport: ProblemsReportResponse | null;
  isLoading: boolean;
}

export function ProblemsSection({
  problemsReport,
  isLoading,
}: ProblemsSectionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Análise de Problemas Mais Comuns
        </h3>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando dados...</p>
          </div>
        ) : problemsReport?.data?.problemas &&
          problemsReport.data.problemas.length > 0 ? (
          <div className="space-y-4">
            {problemsReport.data.problemas.map((problem, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900 capitalize">
                        {problem.item}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {problem.totalReprovacoes} reprovações (
                        {problem.percentualReprovacao.toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Marcas afetadas:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {problem.marcasAfetadas.join(", ")}
                    </p>
                  </div>
                </div>
                {problem.exemplos && problem.exemplos.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      Exemplos:
                    </p>
                    <div className="space-y-1">
                      {problem.exemplos.slice(0, 3).map((exemplo, exIndex) => (
                        <div
                          key={exIndex}
                          className="text-xs text-gray-600 bg-white p-2 rounded border"
                        >
                          <span className="font-medium">{exemplo.veiculo}</span>{" "}
                          ({exemplo.placa}) - {exemplo.comentario}
                        </div>
                      ))}
                      {problem.exemplos.length > 3 && (
                        <p className="text-xs text-gray-500 italic">
                          +{problem.exemplos.length - 3} outros exemplos...
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Nenhum problema encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
