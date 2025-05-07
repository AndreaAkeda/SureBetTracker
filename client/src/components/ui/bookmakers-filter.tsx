import { useQuery } from "@tanstack/react-query";
import { Bookmaker } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface BookmakersFilterProps {
  selectedBookmakers: number[];
  onSelectBookmakers: (bookmakerIds: number[]) => void;
}

export default function BookmakersFilter({
  selectedBookmakers,
  onSelectBookmakers,
}: BookmakersFilterProps) {
  const { data: bookmakers, isLoading } = useQuery<Bookmaker[]>({
    queryKey: ["/api/bookmakers"],
  });

  const handleBookmakerChange = (bookmarkerId: number, checked: boolean) => {
    if (checked) {
      onSelectBookmakers([...selectedBookmakers, bookmarkerId]);
    } else {
      onSelectBookmakers(selectedBookmakers.filter(id => id !== bookmarkerId));
    }
  };

  return (
    <div className="px-4 py-2 border-b border-neutral-200">
      <p className="text-xs uppercase text-neutral-500 font-semibold tracking-wider mb-2">
        Bookmakers
      </p>
      <div className="space-y-1">
        {isLoading ? (
          <div className="py-2 px-2 text-sm text-neutral-500">Loading bookmakers...</div>
        ) : (
          bookmakers?.map((bookmaker) => (
            <div key={bookmaker.id} className="flex items-center">
              <Checkbox
                id={`bm-${bookmaker.id}`}
                checked={selectedBookmakers.includes(bookmaker.id)}
                onCheckedChange={(checked) => 
                  handleBookmakerChange(bookmaker.id, checked as boolean)
                }
                className="w-4 h-4 text-primary border-neutral-300 rounded"
              />
              <Label
                htmlFor={`bm-${bookmaker.id}`}
                className="ml-2 text-sm text-neutral-700"
              >
                {bookmaker.name}
              </Label>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
