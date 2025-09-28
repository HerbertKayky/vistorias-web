"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  useReportOverview,
  useBrandsReport,
  useProblemsReport,
} from "@/hooks/useApi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  ReportHeader,
  DateFilters,
  MetricsCards,
  ChartsSection,
  BrandsTable,
  ProblemsSection,
} from "./_components";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function RelatoriosPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  const { data: overview, isLoading: overviewLoading } = useReportOverview(
    dateRange.from,
    dateRange.to
  );
  const { data: brandsReport, isLoading: brandsLoading } = useBrandsReport();
  const { data: problemsReport, isLoading: problemsLoading } =
    useProblemsReport();

  // Dados para o gráfico de marcas
  const brandsChartData = {
    labels: brandsReport?.data?.marcas?.map((brand) => brand.marca) || [],
    datasets: [
      {
        label: "Total de Vistorias",
        data:
          brandsReport?.data?.marcas?.map((brand) => brand.totalVistorias) ||
          [],
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
      {
        label: "Taxa de Aprovação (%)",
        data:
          brandsReport?.data?.marcas?.map((brand) => brand.taxaAprovacao) || [],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        yAxisID: "y1",
      },
    ],
  };

  // Dados para o gráfico de problemas
  const problemsChartData = {
    labels:
      problemsReport?.data?.problemas?.map((problem) => problem.item) || [],
    datasets: [
      {
        label: "Total de Reprovações",
        data:
          problemsReport?.data?.problemas?.map(
            (problem) => problem.totalReprovacoes
          ) || [],
        backgroundColor: "rgba(239, 68, 68, 0.8)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Relatório de Vistorias",
      },
    },
  };

  const brandsChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Relatório de Marcas",
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Total de Vistorias",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "Taxa de Aprovação (%)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <ReportHeader />

        <DateFilters dateRange={dateRange} onDateRangeChange={setDateRange} />

        <MetricsCards overview={overview} isLoading={overviewLoading} />

        <ChartsSection
          brandsChartData={brandsChartData}
          problemsChartData={problemsChartData}
          chartOptions={chartOptions}
          brandsChartOptions={brandsChartOptions}
          brandsReport={brandsReport}
          brandsLoading={brandsLoading}
          problemsReport={problemsReport}
          problemsLoading={problemsLoading}
        />

        <BrandsTable brandsReport={brandsReport} isLoading={brandsLoading} />

        <ProblemsSection
          problemsReport={problemsReport}
          isLoading={problemsLoading}
        />
      </div>
    </MainLayout>
  );
}
