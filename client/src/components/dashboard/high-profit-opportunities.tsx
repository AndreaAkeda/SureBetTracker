import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ListFilter,
  ChartBar,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Opportunity {
  id: number;
  eventId: number;
  market: string;
  bookmaker1Id: number;
  bookmaker2Id: number;
  odds1: number;
  odds2: number;
  profitPercent: number;
  recommendedInvestment: number;
  isActive: boolean;
  event: {
    id: number;
    name: string;
    sportId: number;
    startTime: string;
    competition: string;
  };
  bookmaker1: {
    id: number;
    name: string;
  };
  bookmaker2: {
    id: number;
    name: string;
  };
  sport: {
    id: number;
    name: string;
  };
}

interface HighProfitOpportunitiesProps {
  selectedSport?: number | null;
  selectedBookmakers?: number[];
  minProfit?: number;
}

export default function HighProfitOpportunities({
  selectedSport,
  selectedBookmakers,
  minProfit,
}: HighProfitOpportunitiesProps) {
  const [sortField, setSortField] = useState<string>("profitPercent");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Build the query key based on filter props
  const queryKey = ["/api/opportunities"];
  const queryParams: Record<string, string> = {};
  
  if (selectedSport) queryParams.sportId = selectedSport.toString();
  if (selectedBookmakers?.length) queryParams.bookmakerIds = selectedBookmakers.join(',');
  if (minProfit) queryParams.minProfit = minProfit.toString();
  
  // Append query params to the API endpoint for the query key
  if (Object.keys(queryParams).length > 0) {
    const queryString = new URLSearchParams(queryParams).toString();
    queryKey[0] = `${queryKey[0]}?${queryString}`;
  }

  const { data: opportunities, isLoading, error, refetch } = useQuery<Opportunity[]>({
    queryKey: queryKey,
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedOpportunities = opportunities
    ? [...opportunities].sort((a, b) => {
        let comparison = 0;
        if (sortField === "event") {
          comparison = a.event.name.localeCompare(b.event.name);
        } else if (sortField === "profitPercent") {
          comparison = Number(a.profitPercent) - Number(b.profitPercent);
        } else if (sortField === "market") {
          comparison = a.market.localeCompare(b.market);
        } else if (sortField === "bookmakers") {
          comparison = `${a.bookmaker1.name} | ${a.bookmaker2.name}`.localeCompare(
            `${b.bookmaker1.name} | ${b.bookmaker2.name}`
          );
        } else if (sortField === "investment") {
          comparison = Number(a.recommendedInvestment) - Number(b.recommendedInvestment);
        }
        
        return sortDirection === "asc" ? comparison : -comparison;
      })
    : [];

  if (error) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Top Profit Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <h3 className="text-lg font-medium text-center mb-1">Error loading opportunities</h3>
            <p className="text-sm text-neutral-500 text-center mb-4">
              Failed to load betting opportunities. Please try again.
            </p>
            <Button onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="p-4 border-b border-neutral-200">
        <div className="flex flex-wrap justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            Top Profit Opportunities
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button size="sm" className="px-3 py-1.5 text-sm" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" variant="ghost" className="p-1.5 text-neutral-500 hover:text-neutral-900 bg-neutral-100 rounded">
              <ListFilter className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <div className="overflow-x-auto">
        <Table className="opportunities">
          <TableHeader className="bg-neutral-50">
            <TableRow>
              <TableHead className="px-4 py-3" onClick={() => handleSort("event")}>
                <div className="flex items-center cursor-pointer">
                  Event
                  {sortField === "event" && (
                    sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4 text-neutral-400" /> : 
                    <ChevronDown className="ml-1 h-4 w-4 text-neutral-400" />
                  )}
                </div>
              </TableHead>
              <TableHead className="px-4 py-3" onClick={() => handleSort("market")}>
                <div className="flex items-center cursor-pointer">
                  Market
                  {sortField === "market" && (
                    sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4 text-neutral-400" /> : 
                    <ChevronDown className="ml-1 h-4 w-4 text-neutral-400" />
                  )}
                </div>
              </TableHead>
              <TableHead className="px-4 py-3" onClick={() => handleSort("bookmakers")}>
                <div className="flex items-center cursor-pointer">
                  Bookmakers
                  {sortField === "bookmakers" && (
                    sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4 text-neutral-400" /> : 
                    <ChevronDown className="ml-1 h-4 w-4 text-neutral-400" />
                  )}
                </div>
              </TableHead>
              <TableHead className="px-4 py-3" onClick={() => handleSort("investment")}>
                <div className="flex items-center cursor-pointer">
                  Investment
                  {sortField === "investment" && (
                    sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4 text-neutral-400" /> : 
                    <ChevronDown className="ml-1 h-4 w-4 text-neutral-400" />
                  )}
                </div>
              </TableHead>
              <TableHead className="px-4 py-3 text-center" onClick={() => handleSort("profitPercent")}>
                <div className="flex items-center justify-center cursor-pointer">
                  Profit %
                  {sortField === "profitPercent" && (
                    sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4 text-neutral-400" /> : 
                    <ChevronDown className="ml-1 h-4 w-4 text-neutral-400" />
                  )}
                </div>
              </TableHead>
              <TableHead className="px-4 py-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="ml-4">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-12 mx-auto" />
                    <Skeleton className="h-2 w-20 mx-auto mt-2" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : sortedOpportunities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center">
                    <ChartBar className="h-8 w-8 text-neutral-400 mb-2" />
                    <p className="text-neutral-500 mb-1">No opportunities found</p>
                    <p className="text-xs text-neutral-400">Try adjusting your filters</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedOpportunities.map((opportunity) => (
                <TableRow key={opportunity.id} className="hover:bg-neutral-50">
                  <TableCell className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
                        <ChartBar className="h-6 w-6 text-neutral-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900">
                          {opportunity.event.name}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {opportunity.sport.name} • {new Date(opportunity.event.startTime).toLocaleString(undefined, {
                            weekday: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-neutral-900">{opportunity.market}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">
                      {opportunity.bookmaker1.name} | {opportunity.bookmaker2.name}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-neutral-900">
                      €{opportunity.recommendedInvestment.toLocaleString()}
                    </div>
                    <div className="text-xs text-neutral-500">Recommended</div>
                  </TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap text-center">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {Number(opportunity.profitPercent).toFixed(1)}%
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-1.5 mx-auto max-w-[80px]">
                      <div
                        className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(Number(opportunity.profitPercent) * 10, 100)}%` }}
                      ></div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="link" className="text-primary hover:text-primary-dark">
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="px-4 py-3 border-t border-neutral-200 bg-neutral-50">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-neutral-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedOpportunities.length}</span> of <span className="font-medium">{sortedOpportunities.length}</span> opportunities
            </p>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </Card>
  );
}
