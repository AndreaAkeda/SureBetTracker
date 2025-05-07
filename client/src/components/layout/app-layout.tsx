import { useState, ReactNode } from "react";
import { useLocation } from "wouter";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/layout/header";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const [selectedSport, setSelectedSport] = useState<number | null>(null);
  const [selectedBookmakers, setSelectedBookmakers] = useState<number[]>([1, 2, 3, 4, 5]); // Default all selected
  const [minProfit, setMinProfit] = useState(1.5);

  // Only show the sidebar and header on dashboard and other pages, not on home
  const isHome = location === "/";

  if (isHome) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar
        selectedSport={selectedSport}
        setSelectedSport={setSelectedSport}
        selectedBookmakers={selectedBookmakers}
        setSelectedBookmakers={setSelectedBookmakers}
        minProfit={minProfit}
        setMinProfit={setMinProfit}
      />

      <div className="flex-1 flex flex-col md:ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          {/* Clone children and pass filter props */}
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                selectedSport,
                selectedBookmakers,
                minProfit,
              });
            }
            return child;
          })}
        </main>
      </div>
    </div>
  );
}
