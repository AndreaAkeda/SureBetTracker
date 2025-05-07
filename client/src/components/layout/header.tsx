import { Link } from "wouter";
import { BellIcon, MenuIcon, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  title?: string;
}

export default function Header({ title = "Dashboard" }: HeaderProps) {
  const isMobile = useMobile();

  const openSidebar = () => {
    // Dispatch a custom event to open the sidebar
    window.dispatchEvent(new Event("open-sidebar"));
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center space-x-3">
          {isMobile && (
            <button
              onClick={openSidebar}
              className="md:hidden text-neutral-500 hover:text-neutral-900"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          )}
          <h2 className="text-lg font-heading font-semibold">{title}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-1 text-neutral-500 hover:text-neutral-900 focus:outline-none">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent"></span>
          </button>
          <Button variant="ghost" className="inline-flex items-center bg-primary-light/10 text-primary-dark hover:bg-primary-light/20 px-3 py-1 rounded-full font-medium text-sm">
            <Lock className="h-5 w-5 mr-1" />
            Premium
          </Button>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-neutral-300 flex items-center justify-center text-neutral-700 font-medium">
              JD
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-2 border-t border-neutral-200 bg-white">
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-sm text-neutral-500">Quick Filters:</div>
          <Button variant="ghost" className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-full text-sm text-neutral-700">
            Today's Matches
          </Button>
          <Button variant="ghost" className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-full text-sm text-neutral-700">
            High Profit (3%+)
          </Button>
          <Button variant="ghost" className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-full text-sm text-neutral-700">
            Closing Soon
          </Button>
          <Button className="px-3 py-1 bg-primary text-white rounded-full text-sm">
            Popular Events
          </Button>
        </div>
      </div>
    </header>
  );
}
