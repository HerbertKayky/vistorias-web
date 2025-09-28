"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { CheckCircle, XCircle, Minus } from "lucide-react";

interface ChecklistItem {
  key: string;
  status: "APROVADO" | "REPROVADO" | "NAO_APLICAVEL";
  comment?: string;
}

interface InspectionChecklistProps {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
  disabled?: boolean;
}

const defaultChecklistItems = [
  "Freios",
  "Pneus",
  "Luzes",
  "Suspensão",
  "Direção",
  "Motor",
  "Transmissão",
  "Sistema elétrico",
  "Documentação",
  "Segurança",
  "Embreagem",
  "Ar condicionado",
  "Sistema de combustível",
  "Escape",
  "Bateria",
];

export function InspectionChecklist({
  items,
  onChange,
  disabled = false,
}: InspectionChecklistProps) {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(() => {
    // Se temos items vindos das props, usar eles
    if (items.length > 0) {
      return items;
    }
    // Caso contrário, usar os itens padrão
    return defaultChecklistItems.map((key) => ({
      key,
      status: "NAO_APLICAVEL",
    }));
  });

  // Sincronizar estado interno com props quando elas mudarem
  useEffect(() => {
    if (items.length > 0) {
      setChecklistItems(items);
    } else {
      // Se não há items, usar os padrões
      setChecklistItems(
        defaultChecklistItems.map((key) => ({ key, status: "NAO_APLICAVEL" }))
      );
    }
  }, [items]);

  const handleStatusChange = (
    index: number,
    status: "APROVADO" | "REPROVADO" | "NAO_APLICAVEL"
  ) => {
    const updatedItems = [...checklistItems];
    updatedItems[index] = {
      ...updatedItems[index],
      status,
      // Manter o comentário existente se houver
      comment: updatedItems[index].comment,
    };
    setChecklistItems(updatedItems);
    onChange(updatedItems);
  };

  const handleCommentChange = (index: number, comment: string) => {
    const updatedItems = [...checklistItems];
    updatedItems[index] = {
      ...updatedItems[index],
      comment: comment.trim() || undefined,
    };
    setChecklistItems(updatedItems);
    onChange(updatedItems);
  };

  const getStatusIcon = (
    status: "APROVADO" | "REPROVADO" | "NAO_APLICAVEL"
  ) => {
    switch (status) {
      case "APROVADO":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "REPROVADO":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (
    status: "APROVADO" | "REPROVADO" | "NAO_APLICAVEL"
  ) => {
    switch (status) {
      case "APROVADO":
        return "bg-green-50 border-green-200";
      case "REPROVADO":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Checklist de Vistoria
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checklistItems.map((item, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg ${getStatusColor(item.status)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-900">{item.key}</span>
                {getStatusIcon(item.status)}
              </div>
              <div className="flex space-x-2 mb-3">
                <Button
                  size="sm"
                  variant={item.status === "APROVADO" ? "primary" : "outline"}
                  onClick={() => handleStatusChange(index, "APROVADO")}
                  disabled={disabled}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Aprovado
                </Button>
                <Button
                  size="sm"
                  variant={item.status === "REPROVADO" ? "danger" : "outline"}
                  onClick={() => handleStatusChange(index, "REPROVADO")}
                  disabled={disabled}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reprovado
                </Button>
                <Button
                  size="sm"
                  variant={
                    item.status === "NAO_APLICAVEL" ? "secondary" : "outline"
                  }
                  onClick={() => handleStatusChange(index, "NAO_APLICAVEL")}
                  disabled={disabled}
                  className="flex-1"
                >
                  <Minus className="h-4 w-4 mr-1" />
                  N/A
                </Button>
              </div>

              {/* Campo de comentário */}
              <Input
                placeholder="Comentário (opcional)..."
                value={item.comment || ""}
                onChange={(e) => handleCommentChange(index, e.target.value)}
                disabled={disabled}
                className="text-sm"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
