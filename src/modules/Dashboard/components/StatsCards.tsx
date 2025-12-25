import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardSummary } from '../services/dashboard.service';

interface StatsCardsProps {
  summary: DashboardSummary;
}

export function StatsCards({ summary }: StatsCardsProps) {
  const cards = [
    {
      title: 'Productos Totales',
      value: summary.totalProducts,
      icon: Package,
      description: 'Inventario disponible',
      color: 'text-blue-600',
    },
    {
      title: 'Clientes Regristrados',
      value: summary.totalClients,
      icon: Users,
      description: 'Base de datos de clientes',
      color: 'text-green-600',
    },
    {
      title: 'Ventas de Hoy',
      value: summary.salesToday,
      icon: ShoppingCart,
      description: 'Ordenes procesadas hoy',
      color: 'text-orange-600',
    },
    {
      title: 'Ingresos del Mes',
      value: `S/ ${summary.revenueMonth?.toFixed(2)}`,
      icon: DollarSign,
      description: 'Total acumulado este mes',
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
