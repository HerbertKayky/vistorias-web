import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface DateFiltersProps {
  dateRange: {
    from: string;
    to: string;
  };
  onDateRangeChange: (dateRange: { from: string; to: string }) => void;
}

export function DateFilters({
  dateRange,
  onDateRangeChange,
}: DateFiltersProps) {
  const handleLastMonth = () => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    onDateRangeChange({
      from: lastMonth.toISOString().split("T")[0],
      to: today.toISOString().split("T")[0],
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Filtros de Período
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Data inicial"
            type="date"
            value={dateRange.from}
            onChange={(e) =>
              onDateRangeChange({ ...dateRange, from: e.target.value })
            }
          />
          <Input
            label="Data final"
            type="date"
            value={dateRange.to}
            onChange={(e) =>
              onDateRangeChange({ ...dateRange, to: e.target.value })
            }
          />
          <div className="flex items-end">
            <Button
              onClick={handleLastMonth}
              variant="outline"
              className="w-full"
            >
              Último Mês
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
