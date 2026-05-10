"use client";

import { TaxBreakdown } from "@/lib/tax-calculator";
import { cn } from "@/lib/utils";

interface BracketChartProps {
  breakdown: TaxBreakdown[];
  netIncome: number;
  className?: string;
}

const BAND_COLORS = [
  "bg-slate-200 dark:bg-slate-700",
  "bg-blue-200 dark:bg-blue-800",
  "bg-blue-300 dark:bg-blue-700",
  "bg-indigo-300 dark:bg-indigo-700",
  "bg-indigo-400 dark:bg-indigo-600",
  "bg-purple-400 dark:bg-purple-600",
  "bg-purple-500 dark:bg-purple-500",
  "bg-red-400 dark:bg-red-600",
];

const TEXT_COLORS = [
  "text-slate-600 dark:text-slate-400",
  "text-blue-600 dark:text-blue-400",
  "text-blue-700 dark:text-blue-300",
  "text-indigo-600 dark:text-indigo-400",
  "text-indigo-700 dark:text-indigo-300",
  "text-purple-600 dark:text-purple-400",
  "text-purple-700 dark:text-purple-300",
  "text-red-600 dark:text-red-400",
];

export function BracketChart({
  breakdown,
  netIncome,
  className,
}: BracketChartProps) {
  // Calculate maximum width for scaling
  const maxValue = Math.max(netIncome, 2000000);

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-semibold">ขั้นบันไดภาษี</h3>

      {/* Visual bar chart */}
      <div className="space-y-1">
        {breakdown.map((bracket, index) => {
          const percentage =
            maxValue > 0 ? (bracket.amount / maxValue) * 100 : 0;

          return (
            <div key={bracket.step} className="group">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] text-muted-foreground leading-none">
                  {bracket.step} ({bracket.rate})
                </span>
                <span className="text-[10px] text-muted-foreground leading-none">
                  {bracket.range}
                </span>
              </div>
              <div className="relative h-4 w-full rounded-sm bg-muted overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-sm transition-all duration-500",
                    BAND_COLORS[index % BAND_COLORS.length]
                  )}
                  style={{ width: `${Math.max(percentage, 0.5)}%` }}
                />
              </div>
              <div className="flex justify-between mt-0.5">
                <span className="text-[10px] text-muted-foreground leading-none">
                  จำนวน: {bracket.amount.toLocaleString("th-TH")}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-medium leading-none",
                    TEXT_COLORS[index % TEXT_COLORS.length]
                  )}
                >
                  ภาษี: {bracket.tax.toLocaleString("th-TH", { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pie-like donut summary */}
      <div className="rounded-lg bg-muted/50 p-3">
        <div className="flex items-center gap-3">
          <div className="relative size-16 shrink-0">
            <svg viewBox="0 0 64 64" className="size-full -rotate-90">
              {breakdown.reduce<{ offset: number; elements: React.ReactNode[] }>(
                (acc, bracket, index) => {
                  const totalTax = breakdown.reduce(
                    (sum, b) => sum + b.tax,
                    0
                  );
                  const slice =
                    totalTax > 0 ? (bracket.tax / totalTax) * 360 : 0;
                  const circumference = 2 * Math.PI * 24;
                  const dashLength = (slice / 360) * circumference;
                  const startAngle = acc.offset;
                  const elements = [
                    ...acc.elements,
                    <circle
                      key={bracket.step}
                      cx="32"
                      cy="32"
                      r="24"
                      fill="none"
                      strokeWidth="8"
                      stroke={`var(--donut-${index})`}
                      strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                      strokeDashoffset={-((startAngle / 360) * circumference)}
                      className={cn(
                        "transition-all duration-500",
                        bracket.tax > 0 ? "opacity-100" : "opacity-0"
                      )}
                      style={
                        {
                          [`--donut-${index}`]:
                            index === 0
                              ? "oklch(0.87 0 0)"
                              : index === 1
                              ? "oklch(0.65 0.15 250)"
                              : index === 2
                              ? "oklch(0.6 0.18 255)"
                              : index === 3
                              ? "oklch(0.55 0.2 260)"
                              : index === 4
                              ? "oklch(0.5 0.22 265)"
                              : index === 5
                              ? "oklch(0.45 0.23 270)"
                              : index === 6
                              ? "oklch(0.4 0.2 275)"
                              : "oklch(0.55 0.15 25)",
                        } as React.CSSProperties
                      }
                    />,
                  ];
                  return {
                    offset: startAngle + slice,
                    elements,
                  };
                },
                { offset: 0, elements: [] }
              ).elements}
              <circle
                cx="32"
                cy="32"
                r="20"
                fill="oklch(0.97 0 0)"
                className="dark:fill-oklch(0.205 0 0)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-semibold text-center leading-tight">
                ภาษี
                <br />
                {breakdown
                  .reduce((sum, b) => sum + b.tax, 0)
                  .toLocaleString("th-TH", { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <ul className="space-y-1">
              {breakdown
                .filter((b) => b.tax > 0)
                .map((bracket, index) => (
                  <li
                    key={bracket.step}
                    className="flex items-center gap-1.5 text-[11px]"
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full shrink-0",
                        BAND_COLORS[
                          breakdown.indexOf(bracket) % BAND_COLORS.length
                        ]
                      )}
                    />
                    <span className="text-muted-foreground truncate">
                      {bracket.step} ({bracket.rate})
                    </span>
                    <span className="font-medium ml-auto shrink-0">
                      {bracket.tax.toLocaleString("th-TH", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
