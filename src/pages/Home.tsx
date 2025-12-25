import { StatsCards } from '@/modules/Dashboard/components/StatsCards';
import { DashboardCharts } from '@/modules/Dashboard/components/DashboardCharts';
import { RecentSales } from '@/modules/Dashboard/components/RecentSales';
import { 
  useDashboardSummary, 
  useSalesChart, 
  useTopProducts, 
  useRecentSales 
} from '@/modules/Dashboard/hooks/useDashboard';
import { Skeleton } from '@/components/ui/skeleton';

export function Home() {
  const { data: summary, isLoading: isLoadingSummary } = useDashboardSummary();
  const { data: salesData, isLoading: isLoadingSales } = useSalesChart();
  const { data: topProducts, isLoading: isLoadingTop } = useTopProducts();
  const { data: recentSales, isLoading: isLoadingRecent } = useRecentSales();

  const isLoading = isLoadingSummary || isLoadingSales || isLoadingTop || isLoadingRecent;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="h-[400px] col-span-4" />
          <Skeleton className="h-[400px] col-span-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general de tu sistema de librería
        </p>
      </div>

      {summary && <StatsCards summary={summary} />}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-4">
          {salesData && topProducts && (
            <DashboardCharts salesData={salesData} topProducts={topProducts} />
          )}
        </div>
        <div className="col-span-3">
          {recentSales && <RecentSales sales={recentSales} />}
        </div>
      </div>
    </div>
  );
}
