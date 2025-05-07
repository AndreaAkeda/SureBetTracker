import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart, CheckCircle, Shield, ArrowRight } from "lucide-react";

export default function Home() {
  const [_, setLocation] = useLocation();

  // Redirect to dashboard after a short delay to showcase landing page
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/dashboard");
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary/90 to-primary-dark text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-10 w-10 mr-3" />
            <h1 className="text-3xl font-heading font-bold">SureBets</h1>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold max-w-3xl mb-6">
            Find Risk-Free Betting Opportunities in Real-Time
          </h2>
          <p className="text-lg max-w-2xl mb-8 text-white/90">
            SureBets helps you identify arbitrage opportunities across multiple bookmakers,
            ensuring consistent profits regardless of the outcome.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 rounded-full px-8 py-6 text-lg font-medium"
            onClick={() => setLocation("/dashboard")}
          >
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">How SureBets Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-Time Monitoring</h3>
              <p className="text-neutral-600">
                Our platform continuously scans odds from major bookmakers to identify profitable arbitrage opportunities.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Guaranteed Profits</h3>
              <p className="text-neutral-600">
                By placing strategic bets across multiple bookmakers, you can lock in profits regardless of the outcome.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Risk Management</h3>
              <p className="text-neutral-600">
                Our calculator shows exactly how much to stake on each bet to ensure consistent returns.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              variant="outline" 
              className="rounded-full px-6 border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => setLocation("/dashboard")}
            >
              Explore Dashboard
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-6 w-6 mr-2" />
            <h3 className="text-xl font-heading font-bold">SureBets</h3>
          </div>
          <p className="text-neutral-400 text-sm">
            &copy; {new Date().getFullYear()} SureBets. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
