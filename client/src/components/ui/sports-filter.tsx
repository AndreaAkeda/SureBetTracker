import { useQuery } from "@tanstack/react-query";
import { Sport } from "@shared/schema";
import { 
  Play, 
  Disc, 
  Eye, 
  ArrowUp, 
  Package, 
  Clock 
} from "lucide-react";

interface SportsFilterProps {
  selectedSport: number | null;
  onSelectSport: (sportId: number | null) => void;
}

export default function SportsFilter({ selectedSport, onSelectSport }: SportsFilterProps) {
  const { data: sports, isLoading } = useQuery<Sport[]>({
    queryKey: ["/api/sports"],
  });

  const getSportIcon = (sportName: string) => {
    switch (sportName.toLowerCase()) {
      case "football":
        return <Disc className="h-5 w-5 mr-2 text-neutral-500" />;
      case "basketball":
        return <Eye className="h-5 w-5 mr-2 text-neutral-500" />;
      case "tennis":
        return <ArrowUp className="h-5 w-5 mr-2 text-neutral-500" />;
      case "ice hockey":
        return <Package className="h-5 w-5 mr-2 text-neutral-500" />;
      case "baseball":
        return <Clock className="h-5 w-5 mr-2 text-neutral-500" />;
      default:
        return <Play className="h-5 w-5 mr-2 text-neutral-500" />;
    }
  };

  return (
    <div className="px-4 py-2 border-b border-neutral-200">
      <p className="text-xs uppercase text-neutral-500 font-semibold tracking-wider mb-2">
        Sports
      </p>
      <div className="space-y-1">
        <button
          onClick={() => onSelectSport(null)}
          className={`flex items-center w-full px-2 py-1.5 text-sm rounded font-medium ${
            selectedSport === null
              ? "text-neutral-900 bg-primary-light/10"
              : "text-neutral-700 hover:bg-neutral-100"
          }`}
        >
          <Play className={`h-5 w-5 mr-2 ${selectedSport === null ? "text-primary" : "text-neutral-500"}`} />
          All Sports
        </button>

        {isLoading ? (
          <div className="py-2 px-2 text-sm text-neutral-500">Loading sports...</div>
        ) : (
          sports?.map((sport) => (
            <button
              key={sport.id}
              onClick={() => onSelectSport(sport.id)}
              className={`flex items-center w-full px-2 py-1.5 text-sm rounded font-medium ${
                selectedSport === sport.id
                  ? "text-neutral-900 bg-primary-light/10"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              {getSportIcon(sport.name)}
              {sport.name}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
