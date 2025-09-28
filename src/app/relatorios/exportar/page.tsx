"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  useReportOverview,
  useBrandsReport,
  useProblemsReport,
} from "@/hooks/useApi";
import {
  ArrowLeft,
  Download,
  Printer,
  Calendar,
  Car,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export default function ExportarRelatoriosPage() {
  const router = useRouter();
  const [dateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  const { data: overview, isLoading: overviewLoading } = useReportOverview(
    dateRange.from,
    dateRange.to
  );
  const { data: brandsReport } = useBrandsReport();
  const { data: problemsReport } = useProblemsReport();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = document.getElementById("relatorio-content");
    if (content) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Relatório de Vistorias - ${new Date().toLocaleDateString(
                "pt-BR"
              )}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
                .stat-card { border: 1px solid #ddd; padding: 15px; text-align: center; }
                .section { margin-bottom: 30px; }
                .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .table th { background-color: #f5f5f5; }
                @media print { body { margin: 0; } }
              </style>
            </head>
            <body>
              ${content.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Relatório Geral de Vistorias
              </h1>
              <p className="text-gray-600">
                Resumo completo do período de {dateRange.from} a {dateRange.to}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handlePrint} variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
          </div>
        </div>

        {/* Conteúdo do Relatório */}
        <div id="relatorio-content" className="space-y-6">
          {/* Informações do Período */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Período Analisado
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Data Inicial</p>
                  <p className="text-lg font-medium">
                    {new Date(dateRange.from).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data Final</p>
                  <p className="text-lg font-medium">
                    {new Date(dateRange.to).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas Principais */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Estatísticas Principais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-3">
                    <Car className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Total de Vistorias</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {overviewLoading ? "..." : overview?.total || 0}
                  </p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">Aprovadas</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {overviewLoading ? "..." : overview?.aprovadas || 0}
                  </p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-red-100 rounded-lg w-fit mx-auto mb-3">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <p className="text-sm text-gray-600">Reprovadas</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {overviewLoading ? "..." : overview?.reprovadas || 0}
                  </p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-3">
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600">Tempo Médio</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {overviewLoading
                      ? "..."
                      : overview?.tempoMedio
                      ? `${overview.tempoMedio.toFixed(0)} min`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo por Marca */}
          {brandsReport?.data?.marcas &&
            brandsReport.data.marcas.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Resumo por Marca
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Marca
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
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {brandsReport.data.marcas.map((brand, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {brand.marca}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {brand.totalVistorias}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                              {brand.aprovadas}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                              {brand.reprovadas}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {brand.taxaAprovacao.toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Principais Problemas */}
          {problemsReport?.data?.problemas &&
            problemsReport.data.problemas.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Principais Problemas Encontrados
                  </h2>
                  <div className="space-y-4">
                    {problemsReport.data.problemas
                      .slice(0, 5)
                      .map((problem, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900 capitalize">
                                {problem.item}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {problem.totalReprovacoes} reprovações (
                                {problem.percentualReprovacao.toFixed(1)}%)
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                Marcas afetadas:
                              </p>
                              <p className="text-sm font-medium text-gray-900">
                                {problem.marcasAfetadas.join(", ")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Rodapé */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-600">
                <p>
                  Relatório gerado em {new Date().toLocaleDateString("pt-BR")}{" "}
                  às {new Date().toLocaleTimeString("pt-BR")}
                </p>
                <p className="text-sm mt-2">Sistema de Gestão de Vistorias</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
