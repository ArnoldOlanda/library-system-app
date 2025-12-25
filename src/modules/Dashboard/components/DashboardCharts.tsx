import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { SalesChartData, TopProduct } from '../services/dashboard.service';

interface DashboardChartsProps {
  salesData: SalesChartData[];
  topProducts: TopProduct[];
}

export function DashboardCharts({ salesData, topProducts }: DashboardChartsProps) {
  const chartConfig = {
    total: {
      label: 'Ventas (S/)',
      color: 'hsl(var(--primary))',
    },
    totalvendido: {
      label: 'Cantidad',
      color: 'hsl(var(--secondary))',
    },
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      {/* Gráfico de Ventas de los últimos 30 días */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Ventas Diarias</CardTitle>
          <CardDescription>
            Visualización de ingresos de los últimos 30 días
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={salesData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
                }}
                className="text-[10px] text-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `S/ ${value}`}
                className="text-[10px] text-muted-foreground"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="total"
                strokeWidth={2}
                dot={false}
                stroke="var(--color-total)"
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Productos Más Vendidos */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Top 5 Productos</CardTitle>
          <CardDescription>
            Productos con mayor número de unidades vendidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
              data={topProducts}
              layout="vertical"
              margin={{ left: 40 }}
            >
              <CartesianGrid horizontal={false} className="stroke-muted" />
              <XAxis type="number" hide />
              <YAxis
                dataKey="nombre"
                type="category"
                tickLine={false}
                axisLine={false}
                className="text-[10px] text-muted-foreground"
                width={80}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="totalvendido"
                fill="var(--color-totalvendido)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
