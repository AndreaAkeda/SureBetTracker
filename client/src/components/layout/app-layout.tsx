import React, { ReactNode } from "react";
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/layout/header";

interface AppLayoutProps {
  children: ReactNode;
  selectedSport: number | null;
  setSelectedSport: (sportId: number | null) => void;
  selectedBookmakers: number[];
  setSelectedBookmakers: (bookmakerIds: number[]) => void;
  minProfit: number;
  setMinProfit: (profit: number) => void;
  isHome: boolean;
}

export default function AppLayout({ 
  children,
  selectedSport,
  setSelectedSport,
  selectedBookmakers,
  setSelectedBookmakers,
  minProfit,
  setMinProfit,
  isHome
}: AppLayoutProps) {
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
          {children}
        </main>
      </div>
    </div>
  );
}
