import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import SportsFilter from "./sports-filter";
import BookmakersFilter from "./bookmakers-filter";
import ProfitRangeSlider from "./profit-range-slider";
import { useMobile } from "@/hooks/use-mobile";
import { 
  TrendingUp, 
  BarChart3, 
  Info
} from "lucide-react";

interface SidebarProps {
  selectedSport: number | null;
  setSelectedSport: (sportId: number | null) => void;
  selectedBookmakers: number[];
  setSelectedBookmakers: (bookmakerIds: number[]) => void;
  minProfit: number;
  setMinProfit: (profit: number) => void;
}

export function Sidebar({
  selectedSport,
  setSelectedSport,
  selectedBookmakers,
  setSelectedBookmakers,
  minProfit,
  setMinProfit
}: SidebarProps) {
  const [location] = useLocation();
  const isMobile = useMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  // Close sidebar on mobile when location changes
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location, isMobile]);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Listen for sidebar open events from the header
  useEffect(() => {
    const handleOpenSidebar = () => setIsSidebarOpen(true);
    window.addEventListener("open-sidebar", handleOpenSidebar);
    
    return () => {
      window.removeEventListener("open-sidebar", handleOpenSidebar);
    };
  }, []);

  const sidebarClass = `sidebar fixed z-20 w-64 h-full bg-white shadow-lg md:relative md:translate-x-0 transition-transform ${
    isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
  }`;

  return (
    <aside id="sidebar" className={sidebarClass}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h1 className="ml-2 text-xl font-heading font-bold text-neutral-900">SureBets</h1>
          </div>
        </Link>
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="md:hidden text-neutral-500 hover:text-neutral-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <SportsFilter 
        selectedSport={selectedSport} 
        onSelectSport={setSelectedSport} 
      />

      <BookmakersFilter 
        selectedBookmakers={selectedBookmakers}
        onSelectBookmakers={setSelectedBookmakers}
      />

      <ProfitRangeSlider 
        minProfit={minProfit}
        onProfitChange={setMinProfit}
      />

      <div className="px-4 pt-4 mt-auto">
        <div className="rounded-lg bg-primary-light/10 p-4">
          <h3 className="font-medium text-primary-dark mb-2">Need Help?</h3>
          <p className="text-sm text-neutral-600 mb-3">
            Contact our support team for assistance with finding the best arbitrage
            opportunities.
          </p>
          <button className="w-full bg-primary hover:bg-primary-dark text-white rounded-lg px-4 py-2 text-sm font-medium">
            Contact Support
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
