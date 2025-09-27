'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { CheckCircle, XCircle, Minus } from 'lucide-react';

interface ChecklistItem {
  name: string;
  status: 'approved' | 'rejected' | 'na';
}

interface InspectionChecklistProps {
  items: ChecklistItem[];
  onChange: (items: ChecklistItem[]) => void;
  disabled?: boolean;
}

const defaultChecklistItems = [
  'Freios',
  'Pneus',
  'Luzes',
  'Suspensão',
  'Direção',
  'Motor',
  'Transmissão',
  'Sistema elétrico',
  'Documentação',
  'Segurança',
  'Embreagem',
  'Ar condicionado',
  'Sistema de combustível',
  'Escape',
  'Bateria',
];

export function InspectionChecklist({ items, onChange, disabled = false }: InspectionChecklistProps) {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(
    items.length > 0 ? items : defaultChecklistItems.map(name => ({ name, status: 'na' }))
  );

  const handleStatusChange = (index: number, status: 'approved' | 'rejected' | 'na') => {
    const updatedItems = [...checklistItems];
    updatedItems[index] = { ...updatedItems[index], status };
    setChecklistItems(updatedItems);
    onChange(updatedItems);
  };

  const getStatusIcon = (status: 'approved' | 'rejected' | 'na') => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: 'approved' | 'rejected' | 'na') => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 border-green-200';
      case 'rejected':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Checklist de Vistoria</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checklistItems.map((item, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg ${getStatusColor(item.status)}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-900">{item.name}</span>
                {getStatusIcon(item.status)}
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={item.status === 'approved' ? 'primary' : 'outline'}
                  onClick={() => handleStatusChange(index, 'approved')}
                  disabled={disabled}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Aprovado
                </Button>
                <Button
                  size="sm"
                  variant={item.status === 'rejected' ? 'danger' : 'outline'}
                  onClick={() => handleStatusChange(index, 'rejected')}
                  disabled={disabled}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reprovado
                </Button>
                <Button
                  size="sm"
                  variant={item.status === 'na' ? 'secondary' : 'outline'}
                  onClick={() => handleStatusChange(index, 'na')}
                  disabled={disabled}
                  className="flex-1"
                >
                  <Minus className="h-4 w-4 mr-1" />
                  N/A
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
