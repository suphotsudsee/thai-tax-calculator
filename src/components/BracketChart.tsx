"use client";

import { TaxBreakdown } from "@/lib/tax-calculator";
import { cn } from "@/lib/utils";
import { Calculator, ArrowRight } from "lucide-react";

interface BracketChartProps {
  breakdown: TaxBreakdown[];
  netIncome: number;
  className?: string;
}

const STEP_ACTIVE_COLORS = [
  "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
  "border-l-blue-500 bg-blue-50 dark:bg-blue-950/30",
  "border-l-indigo-500 bg-indigo-50 dark:bg-indigo-950/30",
  "border-l-purple-500 bg-purple-50 dark:bg-purple-950/30",
  "border-l-pink-500 bg-pink-50 dark:bg-pink-950/30",
  "border-l-orange-500 bg-orange-50 dark:bg-orange-950/30",
  "border-l-red-500 bg-red-50 dark:bg-red-950/30",
  "border-l-rose-500 bg-rose-50 dark:bg-rose-950/30",
];

export function BracketChart({
  breakdown,
  netIncome,
  className,
}: BracketChartProps) {
  const totalTax = breakdown.reduce((sum, b) => sum + b.tax, 0);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Calculator className="size-4 text-primary" />
        <h3 className="text-sm font-bold">
          วิธีคิดภาษีแบบขั้นบันได
        </h3>
      </div>

      {/* Net income summary line */}
      <div className="rounded-lg bg-muted/50 px-3 py-2.5 text-center">
        <span className="text-xs text-muted-foreground">เงินได้สุทธิ = </span>
        <span className="text-base font-bold text-foreground">
          {netIncome.toLocaleString("th-TH")}
        </span>
        <span className="text-xs text-muted-foreground"> บาท</span>
      </div>

      {/* Step-by-step for EACH bracket */}
      <div className="space-y-2">
        {breakdown.map((bracket, index) => {
          const isActive = bracket.tax > 0;
          const isLastActive =
            isActive &&
            breakdown.slice(index + 1).every((b) => b.tax === 0);

          return (
            <div
              key={bracket.step}
              className={cn(
                "relative rounded-lg border border-l-4 p-3 transition-all",
                isActive
                  ? cn(
                      STEP_ACTIVE_COLORS[index % STEP_ACTIVE_COLORS.length],
                      "shadow-sm"
                    )
                  : "border-l-muted bg-muted/20 opacity-60"
              )}
            >
              {/* Step label */}
              <div className="flex items-center gap-1.5 mb-2">
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {bracket.step}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  ช่วง {bracket.range} บาท
                </span>
                <span
                  className={cn(
                    "text-[10px] font-medium ml-auto",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  อัตรา {bracket.rate}
                </span>
              </div>

              {/* Formula display */}
              {isActive ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-medium text-foreground">
                      {bracket.amount.toLocaleString("th-TH")}
                    </span>
                    <span className="text-muted-foreground">×</span>
                    <span className="text-muted-foreground">
                      {bracket.rate.replace("%", "")}%
                    </span>
                    <ArrowRight className="size-3 text-muted-foreground" />
                    <span className="font-bold text-foreground">
                      {bracket.tax.toLocaleString("th-TH", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                    <span className="text-muted-foreground">บาท</span>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-muted-foreground">
                  ไม่ถึงเกณฑ์ — ยกเว้นภาษี
                </div>
              )}

              {/* Connector line between steps */}
              {isActive && !isLastActive && (
                <div className="absolute -bottom-2.5 left-6 z-10">
                  <div className="size-5 rounded-full bg-background border flex items-center justify-center">
                    <span className="text-[8px] text-muted-foreground font-bold">
                      +
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-white/80">
              รวมภาษีทั้งปี
            </div>
            <div className="text-lg font-bold">
              {totalTax.toLocaleString("th-TH", {
                maximumFractionDigits: 0,
              })}{" "}
              <span className="text-sm font-normal text-white/80">บาท</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-medium text-white/80">
              เฉลี่ยต่อเดือน
            </div>
            <div className="text-lg font-bold">
              {(totalTax / 12).toLocaleString("th-TH", {
                maximumFractionDigits: 2,
              })}{" "}
              <span className="text-sm font-normal text-white/80">บาท</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
