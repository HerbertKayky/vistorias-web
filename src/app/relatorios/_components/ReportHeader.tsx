import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";

export function ReportHeader() {
  const router = useRouter();

  const handleExport = () => {
    router.push("/relatorios/exportar");
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600">Análise e métricas do sistema</p>
      </div>
      <Button onClick={handleExport}>
        <Download className="h-4 w-4 mr-2" />
        Exportar Relatório
      </Button>
    </div>
  );
}
