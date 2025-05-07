import { Slider } from "@/components/ui/slider";

interface ProfitRangeSliderProps {
  minProfit: number;
  onProfitChange: (value: number) => void;
}

export default function ProfitRangeSlider({
  minProfit,
  onProfitChange,
}: ProfitRangeSliderProps) {
  return (
    <div className="px-4 py-2">
      <p className="text-xs uppercase text-neutral-500 font-semibold tracking-wider mb-2">
        Profit Range
      </p>
      <div className="mb-4">
        <Slider
          defaultValue={[minProfit]}
          max={10}
          step={0.1}
          onValueChange={(values) => onProfitChange(values[0])}
          className="w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-neutral-500">0%</span>
          <span className="text-xs text-neutral-500">5%</span>
          <span className="text-xs text-neutral-500">10%+</span>
        </div>
        <div className="text-center mt-2">
          <span className="text-sm font-medium">Min: {minProfit}%</span>
        </div>
      </div>
    </div>
  );
}
