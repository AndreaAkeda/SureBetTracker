import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, BarChart3, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStatsResponse {
  activeOpportunitiesCount: number;
  averageProfitPercent: number;
  highestProfitPercent: number;
  highestProfitOpportunityId?: number;
}

export default function DashboardSummary() {
  const { data: stats, isLoading } = useQuery<DashboardStatsResponse>({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-8 w-16 mb-3" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-medium text-neutral-900">Error loading stats</h3>
            </div>
            <p className="text-sm text-neutral-600">Failed to load dashboard statistics.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-sm text-neutral-500">Active Opportunities</p>
              <h3 className="text-2xl font-semibold text-neutral-900">
                {stats.activeOpportunitiesCount}
              </h3>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.3%
            </span>
            <span className="text-xs text-neutral-500 ml-2">since yesterday</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-sm text-neutral-500">Average Profit</p>
              <h3 className="text-2xl font-semibold text-neutral-900">
                {stats.averageProfitPercent}%
              </h3>
            </div>
            <div className="bg-primary-light/20 p-2 rounded-full">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-primary flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.3%
            </span>
            <span className="text-xs text-neutral-500 ml-2">since last week</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-sm text-neutral-500">Highest Profit</p>
              <h3 className="text-2xl font-semibold text-neutral-900">
                {stats.highestProfitPercent}%
              </h3>
            </div>
            <div className="bg-accent-light/20 p-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-accent-dark" />
            </div>
          </div>
          <div className="mt-1">
            <div className="text-xs text-neutral-500">Barcelona vs Real Madrid</div>
            <button className="mt-2 text-xs bg-accent/10 text-accent-dark px-2 py-1 rounded flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              View Details
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
