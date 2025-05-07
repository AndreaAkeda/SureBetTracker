import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import AppLayout from "./components/layout/app-layout";
import { useState } from "react";

function Router() {
  const [selectedSport, setSelectedSport] = useState<number | null>(null);
  const [selectedBookmakers, setSelectedBookmakers] = useState<number[]>([1, 2, 3, 4, 5]); // Default all selected
  const [minProfit, setMinProfit] = useState(1.5);
  const [location] = useLocation();
  
  // Only show the sidebar and header on dashboard and other pages, not on home
  const isHome = location === "/";
  
  const dashboardProps = {
    selectedSport,
    selectedBookmakers,
    minProfit
  };
  
  const layoutProps = {
    selectedSport,
    setSelectedSport,
    selectedBookmakers,
    setSelectedBookmakers,
    minProfit,
    setMinProfit,
    isHome
  };
  
  return (
    <AppLayout {...layoutProps}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard">
          {() => <Dashboard {...dashboardProps} />}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
