import DashboardSummary from "@/components/dashboard/dashboard-summary";
import HighProfitOpportunities from "@/components/dashboard/high-profit-opportunities";
import ProfitCalculator from "@/components/dashboard/profit-calculator";
import SportsDistribution from "@/components/dashboard/sports-distribution";
import RecentActivity from "@/components/dashboard/recent-activity";
import UpcomingEvents from "@/components/dashboard/upcoming-events";

interface DashboardProps {
  selectedSport?: number | null;
  selectedBookmakers?: number[];
  minProfit?: number;
}

export default function Dashboard({
  selectedSport,
  selectedBookmakers,
  minProfit,
}: DashboardProps) {
  return (
    <>
      <DashboardSummary />
      
      <HighProfitOpportunities 
        selectedSport={selectedSport}
        selectedBookmakers={selectedBookmakers}
        minProfit={minProfit}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <ProfitCalculator />
        </div>
        <div>
          <SportsDistribution />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentActivity />
        <UpcomingEvents />
      </div>
    </>
  );
}
