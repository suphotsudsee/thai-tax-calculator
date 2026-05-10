"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BracketChart } from "@/components/BracketChart";
import { TaxResultCard } from "@/components/TaxResultCard";
import {
  calculateTax,
  getDefaultInput,
  TaxInput,
  TaxResult,
} from "@/lib/tax-calculator";
import { PieChart } from "lucide-react";

export default function BreakdownPage() {
  const [salary, setSalary] = useState(30000);
  const [deductions, setDeductions] = useState(0);
  const [donation, setDonation] = useState(0);
  const [lifeInsurance, setLifeInsurance] = useState(0);

  const input: TaxInput = useMemo(
    () => ({
      ...getDefaultInput(),
      monthlySalary: salary,
      socialSecurity: 9000,
      lifeInsurance,
      donation,
      otherDeductions: deductions,
    }),
    [salary, deductions, donation, lifeInsurance]
  );

  const result: TaxResult = useMemo(() => calculateTax(input), [input]);

  const totalTax = result.breakdown.reduce((sum, b) => sum + b.tax, 0);

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-lg px-4 py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
            <PieChart className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">รายละเอียดภาษี</h1>
            <p className="text-xs text-muted-foreground">
              ดูรายละเอียดการคำนวณภาษีในแต่ละขั้น
            </p>
          </div>
        </div>

        {/* Quick Inputs */}
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm">ข้อมูลคำนวณ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>เงินเดือน (บาท)</Label>
                <Input
                  type="number"
                  value={salary || ""}
                  onChange={(e) => setSalary(Number(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>ลดหย่อนอื่นๆ (บาท)</Label>
                <Input
                  type="number"
                  value={deductions || ""}
                  onChange={(e) => setDeductions(Number(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>ประกันชีวิต (บาท)</Label>
                <Input
                  type="number"
                  value={lifeInsurance || ""}
                  onChange={(e) =>
                    setLifeInsurance(Number(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>เงินบริจาค (บาท)</Label>
                <Input
                  type="number"
                  value={donation || ""}
                  onChange={(e) => setDonation(Number(e.target.value) || 0)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <TaxResultCard result={result} />

        {/* Income Breakdown Vis */}
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm">สัดส่วนรายได้</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Horizontal stacked bar: Income → after expenses → after deductions → net */}
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-muted-foreground">รายได้ทั้งปี</span>
                  <span className="font-medium">
                    {result.annualIncome.toLocaleString("th-TH")}
                  </span>
                </div>
                <div className="h-5 w-full rounded-full bg-muted overflow-hidden flex">
                  {/* Net income portion */}
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
                    style={{
                      width: `${
                        result.annualIncome > 0
                          ? (result.netIncome / result.annualIncome) * 100
                          : 0
                      }%`,
                    }}
                  />
                  {/* Deductions portion */}
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                    style={{
                      width: `${
                        result.annualIncome > 0
                          ? (result.totalDeductions / result.annualIncome) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                  {/* Expenses portion */}
                  <div
                    className="h-full bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-500"
                    style={{
                      width: `${
                        result.annualIncome > 0
                          ? (result.expenses / result.annualIncome) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-muted-foreground">
                      รายได้สุทธิ{" "}
                      <span className="font-medium text-foreground">
                        {result.netIncome.toLocaleString("th-TH")}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-amber-500" />
                    <span className="text-[10px] text-muted-foreground">
                      ลดหย่อน{" "}
                      <span className="font-medium text-foreground">
                        {result.totalDeductions.toLocaleString("th-TH")}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-rose-500" />
                    <span className="text-[10px] text-muted-foreground">
                      ค่าใช้จ่าย{" "}
                      <span className="font-medium text-foreground">
                        {result.expenses.toLocaleString("th-TH")}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax vs Net Income donut comparison */}
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm">
              ภาษีเทียบกับรายได้สุทธิ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-4 justify-center">
                {/* Simple CSS pie using conic-gradient */}
                {result.annualIncome > 0 && (
                  <div className="relative size-28">
                    <div
                      className="size-full rounded-full"
                      style={{
                        background: `conic-gradient(
                          #ef4444 0deg ${
                            (result.annualTax / result.annualIncome) * 360
                          }deg,
                          #22c55e ${
                            (result.annualTax / result.annualIncome) * 360
                          }deg ${
                            ((result.netIncome - result.annualTax) /
                              result.annualIncome) *
                            360
                          }deg,
                          #f59e0b ${
                            ((result.netIncome - result.annualTax) /
                              result.annualIncome) *
                            360
                          }deg 360deg
                        )`,
                      }}
                    />
                    <div className="absolute inset-[25%] rounded-full bg-card flex items-center justify-center">
                      <span className="text-xs font-bold text-center">
                        {result.effectiveTaxRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-red-500" />
                    <span className="text-[11px]">ภาษี</span>
                    <span className="text-[11px] font-medium ml-auto">
                      {result.annualTax.toLocaleString("th-TH", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px]">รายได้หลังหักภาษี</span>
                    <span className="text-[11px] font-medium ml-auto">
                      {(
                        result.netIncome - result.annualTax
                      ).toLocaleString("th-TH", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-amber-500" />
                    <span className="text-[11px]">ค่าใช้จ่าย+ลดหย่อน</span>
                    <span className="text-[11px] font-medium ml-auto">
                      {(
                        result.expenses + result.totalDeductions
                      ).toLocaleString("th-TH", {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bracket Chart */}
        <Card size="sm">
          <CardContent className="pt-4">
            <BracketChart
              breakdown={result.breakdown}
              netIncome={result.netIncome}
            />
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <p className="text-center text-[11px] text-muted-foreground pb-4">
          * อัตราภาษีอิงตามกฎหมายภาษีเงินได้บุคคลธรรมดาล่าสุด ตัวเลขอาจ
          คลาดเคลื่อนเล็กน้อยจากการปัดเศษ
        </p>
      </div>
    </div>
  );
}
