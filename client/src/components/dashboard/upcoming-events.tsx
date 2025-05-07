import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Event {
  id: number;
  name: string;
  sportId: number;
  startTime: string;
  competition: string;
  status: string;
  sport: {
    id: number;
    name: string;
  };
}

export default function UpcomingEvents() {
  const { data: events, isLoading, error } = useQuery<Event[]>({
    queryKey: ["/api/events/upcoming"],
  });

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format the time
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Check if date is today, tomorrow, or other
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${timeString}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${timeString}`;
    } else {
      return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, ${timeString}`;
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader className="p-4 border-b border-neutral-200">
          <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
          <h3 className="text-base font-medium mb-1">Error loading events</h3>
          <p className="text-sm text-neutral-500 mb-3">
            Failed to load upcoming events.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-4 border-b border-neutral-200">
        <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <ul className="divide-y divide-neutral-200">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <li key={i} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-5 w-5 rounded" />
                    <div>
                      <Skeleton className="h-4 w-40 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-3 w-20 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </li>
            ))
          ) : events?.length === 0 ? (
            <li className="p-6 text-center">
              <p className="text-neutral-500">No upcoming events found.</p>
            </li>
          ) : (
            events?.map((event) => (
              <li key={event.id} className="p-3 hover:bg-neutral-50 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-neutral-400" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{event.name}</p>
                      <p className="text-xs text-neutral-500">
                        {event.sport.name} • {event.competition}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-neutral-500">
                      {formatEventTime(event.startTime)}
                    </div>
                    {/* Conditionally show "High potential" for some events */}
                    {(event.id % 2 === 0) && (
                      <div className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-0.5 rounded-full mt-1 inline-block">
                        High potential
                      </div>
                    )}
                    {(event.id % 3 === 0) && (
                      <div className="text-xs bg-accent bg-opacity-10 text-accent-dark px-2 py-0.5 rounded-full mt-1 inline-block">
                        Watch list
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </CardContent>
      <div className="p-3 border-t border-neutral-200 text-center">
        <Button variant="link" className="text-primary hover:text-primary-dark text-sm font-medium">
          View All Events
        </Button>
      </div>
    </Card>
  );
}
