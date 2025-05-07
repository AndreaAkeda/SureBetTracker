import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface SportDistribution {
  sportId: number;
  sportName: string;
  count: number;
}

const COLORS = [
  "bg-primary",
  "bg-secondary",
  "bg-accent",
  "bg-neutral-400",
  "bg-neutral-600",
];

export default function SportsDistribution() {
  const { data: distribution, isLoading, error } = useQuery<SportDistribution[]>({
    queryKey: ["/api/dashboard/sports-distribution"],
  });

  // Calculate total count for percentages
  const totalCount = distribution?.reduce((sum, sport) => sum + sport.count, 0) || 0;

  if (error) {
    return (
      <Card>
        <CardHeader className="p-4 border-b border-neutral-200">
          <CardTitle className="text-lg font-semibold">Sports Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
          <h3 className="text-base font-medium mb-1">Error loading data</h3>
          <p className="text-sm text-neutral-500 mb-3">
            Failed to load sports distribution.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-4 border-b border-neutral-200">
        <CardTitle className="text-lg font-semibold">Sports Distribution</CardTitle>
        <p className="text-sm text-neutral-500 mt-1">Current opportunities by sport</p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))
          ) : distribution?.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-neutral-500">No distribution data available.</p>
            </div>
          ) : (
            distribution?.map((sport, index) => (
              <div key={sport.sportId}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{sport.sportName}</span>
                  <span className="text-sm text-neutral-500">{sport.count} opps</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className={`${COLORS[index % COLORS.length]} h-2 rounded-full`}
                    style={{ width: `${totalCount > 0 ? (sport.count / totalCount) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-6 pt-4 border-t border-neutral-200">
          <Button variant="link" className="text-primary hover:text-primary-dark text-sm font-medium p-0">
            View All Statistics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
