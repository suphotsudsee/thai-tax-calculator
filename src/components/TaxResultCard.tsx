"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaxResult, formatCurrencyTHB, formatCurrencyTHBShort } from "@/lib/tax-calculator";
import { TrendingDown, Wallet, Calendar, Percent } from "lucide-react";

interface TaxResultCardProps {
  result: TaxResult;
  className?: string;
}

export function TaxResultCard({ result, className }: TaxResultCardProps) {
  const stats = [
    {
      label: "ภาษีทั้งปี",
      value: `${formatCurrencyTHB(result.annualTax)} บาท`,
      icon: TrendingDown,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      label: "ภาษีต่อเดือน",
      value: `${formatCurrencyTHB(result.monthlyTax)} บาท`,
      icon: Calendar,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "รายได้สุทธิ/เดือน",
      value: `${formatCurrencyTHB(result.netMonthlyAfterTax)} บาท`,
      icon: Wallet,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "อัตราภาษีที่แท้จริง",
      value: `${result.effectiveTaxRate.toFixed(1)}%`,
      icon: Percent,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <Card className={className} size="sm">
      <CardHeader>
        <CardTitle className="text-base">
          {result.isExempt
            ? "🎉 ไม่ต้องเสียภาษี!"
            : "📊 สรุปผลการคำนวณภาษี"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {result.isExempt ? (
          <div className="rounded-lg bg-emerald-500/10 p-4 text-center">
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              รายได้ของคุณไม่ถึงเกณฑ์ที่ต้องเสียภาษี รายได้สุทธิหลังหักค่าใช้จ่ายและค่าลดหย่อนต่ำกว่า 150,000 บาท
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary stats grid */}
            <div className="grid grid-cols-2 gap-2">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="flex flex-col gap-1 rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-1.5">
                      <div className={`rounded-md p-1 ${stat.bg}`}>
                        <Icon className={`size-3 ${stat.color}`} />
                      </div>
                      <span className="text-[11px] text-muted-foreground leading-none">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {stat.value}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Income flow */}
            <div className="rounded-lg bg-muted/50 p-3 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">รายได้ทั้งปี</span>
                <span className="font-medium">
                  {formatCurrencyTHBShort(result.annualIncome)} บาท
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">− ค่าใช้จ่าย</span>
                <span className="font-medium text-red-500">
                  {formatCurrencyTHBShort(result.expenses)} บาท
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">− ค่าลดหย่อน</span>
                <span className="font-medium text-red-500">
                  {formatCurrencyTHBShort(result.totalDeductions)} บาท
                </span>
              </div>
              <div className="border-t border-border pt-1.5 flex justify-between text-xs">
                <span className="font-medium">รายได้สุทธิเพื่อคำนวณภาษี</span>
                <span className="font-semibold text-primary">
                  {formatCurrencyTHBShort(result.netIncome)} บาท
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
