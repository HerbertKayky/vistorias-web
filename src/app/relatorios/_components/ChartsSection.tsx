import { Card, CardContent } from "@/components/ui/Card";
import { Bar } from "react-chartjs-2";
import { BrandsReportResponse, ProblemsReportResponse } from "@/types";

interface ChartsSectionProps {
  brandsChartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
      yAxisID?: string;
    }[];
  };
  problemsChartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
  chartOptions: {
    responsive: boolean;
    plugins: {
      legend: {
        position: "top";
      };
      title: {
        display: boolean;
        text: string;
      };
    };
  };
  brandsChartOptions: {
    responsive: boolean;
    plugins: {
      legend: {
        position: "top";
      };
      title: {
        display: boolean;
        text: string;
      };
    };
    scales: {
      y: {
        type: "linear";
        display: boolean;
        position: "left";
        title: {
          display: boolean;
          text: string;
        };
      };
      y1: {
        type: "linear";
        display: boolean;
        position: "right";
        title: {
          display: boolean;
          text: string;
        };
        grid: {
          drawOnChartArea: boolean;
        };
      };
    };
  };
  brandsReport: BrandsReportResponse | null;
  brandsLoading: boolean;
  problemsReport: ProblemsReportResponse | null;
  problemsLoading: boolean;
}

export function ChartsSection({
  brandsChartData,
  problemsChartData,
  chartOptions,
  brandsChartOptions,
  brandsReport,
  brandsLoading,
  problemsReport,
  problemsLoading,
}: ChartsSectionProps) {
  return (
    <>
      {/* Gráfico de marcas */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Relatório de Marcas Mais Vistoriadas
          </h3>
          {brandsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando dados...</p>
            </div>
          ) : brandsReport?.data?.marcas &&
            brandsReport.data.marcas.length > 0 ? (
            <div className="h-64">
              <Bar data={brandsChartData} options={brandsChartOptions} />
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Nenhum dado de marca encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de problemas */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Principais Problemas Encontrados
          </h3>
          {problemsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando dados...</p>
            </div>
          ) : problemsReport?.data?.problemas &&
            problemsReport.data.problemas.length > 0 ? (
            <div className="h-64">
              <Bar data={problemsChartData} options={chartOptions} />
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Nenhum problema encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
