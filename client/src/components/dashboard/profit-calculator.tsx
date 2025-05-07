import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { Bookmaker } from "@shared/schema";

interface ProfitCalculationResult {
  profit: number;
  profitPercent: number;
  stake1: number;
  stake2: number;
}

export default function ProfitCalculator() {
  const [bookmaker1, setBookmaker1] = useState<string>("");
  const [bookmaker2, setBookmaker2] = useState<string>("");
  const [odds1, setOdds1] = useState<string>("2.10");
  const [odds2, setOdds2] = useState<string>("1.92");
  const [totalStake, setTotalStake] = useState<string>("1000");
  const [calculationResult, setCalculationResult] = useState<ProfitCalculationResult | null>(null);

  const { data: bookmakers, isLoading: isLoadingBookmakers } = useQuery<Bookmaker[]>({
    queryKey: ["/api/bookmakers"],
  });

  const calculateMutation = useMutation({
    mutationFn: async (data: { odds1: number; odds2: number; totalStake: number }) => {
      const response = await apiRequest("POST", "/api/calculator/profit", data);
      return response.json();
    },
    onSuccess: (data: ProfitCalculationResult) => {
      setCalculationResult(data);
    },
  });

  const handleCalculate = () => {
    if (!odds1 || !odds2 || !totalStake) return;
    
    calculateMutation.mutate({
      odds1: parseFloat(odds1),
      odds2: parseFloat(odds2),
      totalStake: parseFloat(totalStake)
    });
  };

  return (
    <Card>
      <CardHeader className="p-4 border-b border-neutral-200">
        <CardTitle className="text-lg font-semibold">Profit Calculator</CardTitle>
        <p className="text-sm text-neutral-500 mt-1">
          Calculate your potential profit for any arbitrage opportunity
        </p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="block text-sm font-medium text-neutral-700 mb-1">
              Bookmaker 1
            </Label>
            <Select value={bookmaker1} onValueChange={setBookmaker1}>
              <SelectTrigger>
                <SelectValue placeholder="Select bookmaker" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingBookmakers ? (
                  <SelectItem value="loading">Loading bookmakers...</SelectItem>
                ) : (
                  bookmakers?.map((bookmaker) => (
                    <SelectItem key={bookmaker.id} value={bookmaker.id.toString()}>
                      {bookmaker.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="block text-sm font-medium text-neutral-700 mb-1">
              Bookmaker 2
            </Label>
            <Select value={bookmaker2} onValueChange={setBookmaker2}>
              <SelectTrigger>
                <SelectValue placeholder="Select bookmaker" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingBookmakers ? (
                  <SelectItem value="loading">Loading bookmakers...</SelectItem>
                ) : (
                  bookmakers?.map((bookmaker) => (
                    <SelectItem key={bookmaker.id} value={bookmaker.id.toString()}>
                      {bookmaker.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="block text-sm font-medium text-neutral-700 mb-1">
              Odds 1
            </Label>
            <Input
              type="number"
              value={odds1}
              onChange={(e) => setOdds1(e.target.value)}
              step="0.01"
              min="1.01"
              className="w-full"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-neutral-700 mb-1">
              Odds 2
            </Label>
            <Input
              type="number"
              value={odds2}
              onChange={(e) => setOdds2(e.target.value)}
              step="0.01"
              min="1.01"
              className="w-full"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-neutral-700 mb-1">
              Total Stake (€)
            </Label>
            <Input
              type="number"
              value={totalStake}
              onChange={(e) => setTotalStake(e.target.value)}
              step="100"
              min="100"
              className="w-full"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-neutral-700 mb-1">
              &nbsp;
            </Label>
            <Button
              className="w-full"
              onClick={handleCalculate}
              disabled={calculateMutation.isPending}
            >
              {calculateMutation.isPending ? "Calculating..." : "Calculate"}
            </Button>
          </div>
        </div>
        
        {(calculationResult || calculateMutation.isPending) && (
          <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-500">Profit</p>
                <p className="text-xl font-semibold text-green-600">
                  {calculateMutation.isPending ? "..." : `€${calculationResult?.profit.toFixed(2)}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Profit %</p>
                <p className="text-xl font-semibold text-green-600">
                  {calculateMutation.isPending ? "..." : `${calculationResult?.profitPercent.toFixed(2)}%`}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Stake 1</p>
                <p className="text-lg font-medium">
                  {calculateMutation.isPending ? "..." : `€${calculationResult?.stake1.toFixed(2)}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Stake 2</p>
                <p className="text-lg font-medium">
                  {calculateMutation.isPending ? "..." : `€${calculationResult?.stake2.toFixed(2)}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
