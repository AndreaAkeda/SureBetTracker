import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityLog {
  id: number;
  type: string;
  message: string;
  relatedOpportunityId?: number;
  createdAt: string;
  opportunity?: {
    id: number;
    eventId: number;
    market: string;
    profitPercent: number;
    event: {
      id: number;
      name: string;
    };
  };
}

export default function RecentActivity() {
  const { data: activityLogs, isLoading, error } = useQuery<ActivityLog[]>({
    queryKey: ["/api/activity-logs"],
  });

  const getIconForActivityType = (type: string) => {
    switch (type) {
      case "new_opportunity":
        return (
          <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        );
      case "odds_change":
        return (
          <div className="h-9 w-9 rounded-full bg-yellow-100 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </div>
        );
      case "opportunity_expired":
        return (
          <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
        );
      case "system_update":
        return (
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
        );
      default:
        return (
          <div className="h-9 w-9 rounded-full bg-neutral-100 flex items-center justify-center">
            <Info className="h-5 w-5 text-neutral-600" />
          </div>
        );
    }
  };

  const getStatusText = (type: string) => {
    switch (type) {
      case "new_opportunity":
        return <div className="font-semibold text-green-600 mt-1">New</div>;
      case "odds_change":
        return <div className="font-semibold text-yellow-600 mt-1">Monitor</div>;
      case "opportunity_expired":
        return <div className="font-semibold text-red-600 mt-1">Closed</div>;
      default:
        return null;
    }
  };

  const getTimeSince = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  if (error) {
    return (
      <Card>
        <CardHeader className="p-4 border-b border-neutral-200">
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
          <h3 className="text-base font-medium mb-1">Error loading activity</h3>
          <p className="text-sm text-neutral-500 mb-3">
            Failed to load recent activity data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-4 border-b border-neutral-200">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <ul className="divide-y divide-neutral-200">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <li key={i} className="p-3">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-4 w-48 mb-1" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              </li>
            ))
          ) : activityLogs?.length === 0 ? (
            <li className="p-6 text-center">
              <p className="text-neutral-500">No recent activity.</p>
            </li>
          ) : (
            activityLogs?.map((log) => (
              <li key={log.id} className="p-3 hover:bg-neutral-50 rounded-md">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getIconForActivityType(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900">
                      {log.message}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {log.opportunity ? `${log.opportunity.event.name} - ${log.opportunity.market}` : ""}
                    </p>
                  </div>
                  <div className="text-right text-xs text-neutral-500">
                    <div>{getTimeSince(log.createdAt)}</div>
                    {log.opportunity && log.type === "new_opportunity" && (
                      <div className="font-semibold text-green-600 mt-1">
                        {Number(log.opportunity.profitPercent).toFixed(1)}%
                      </div>
                    )}
                    {log.type !== "new_opportunity" && getStatusText(log.type)}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </CardContent>
      <div className="p-3 border-t border-neutral-200 text-center">
        <Button variant="link" className="text-primary hover:text-primary-dark text-sm font-medium">
          View All Activity
        </Button>
      </div>
    </Card>
  );
}
