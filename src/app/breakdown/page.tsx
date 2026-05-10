"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  calculateTax,
  getDefaultInput,
  TaxInput,
  TaxResult,
} from "@/lib/tax-calculator";
import { PieChart } from "lucide-react";

function fmt(n: number): string {
  return n.toLocaleString("th-TH");
}

export default function BreakdownPage() {
  const [salary, setSalary] = useState(40000);
  const [bonus, setBonus] = useState(0);
  const [bonusMonths, setBonusMonths] = useState(1);
  const [pvd, setPvd] = useState(0);
  const [socialSecurity, setSocialSecurity] = useState(0);
  const [lifeInsurance, setLifeInsurance] = useState(0);
  const [donation, setDonation] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(0);

  const input: TaxInput = useMemo(
    () => ({
      ...getDefaultInput(),
      monthlySalary: salary,
      bonus,
      bonusMonths,
      socialSecurity,
      providentFund: pvd,
      lifeInsurance,
      donation,
      otherDeductions,
    }),
    [salary, bonus, bonusMonths, pvd, socialSecurity, lifeInsurance, donation, otherDeductions]
  );

  const result: TaxResult = useMemo(() => calculateTax(input), [input]);
  const totalTax = result.breakdown.reduce((sum, b) => sum + b.tax, 0);

  // Only show brackets that have tax (active steps)
  const activeBrackets = result.breakdown.filter((b) => b.tax > 0);

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
              ดูวิธีคิดภาษีทีละขั้นแบบขั้นบันได
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
                <Label>เงินเดือน (บาท/เดือน)</Label>
                <Input
                  type="number"
                  value={salary || ""}
                  onChange={(e) => setSalary(Number(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>โบนัส (บาท)</Label>
                <Input
                  type="number"
                  value={bonus || ""}
                  onChange={(e) => setBonus(Number(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>กองทุนสำรองเลี้ยงชีพ (บาท/ปี)</Label>
                <Input
                  type="number"
                  value={pvd || ""}
                  onChange={(e) => setPvd(Number(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>ประกันสังคม (บาท/ปี)</Label>
                <Input
                  type="number"
                  value={socialSecurity || ""}
                  onChange={(e) =>
                    setSocialSecurity(Number(e.target.value) || 0)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>ประกันชีวิต (บาท/ปี)</Label>
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

        {/* === MAIN CARD: Net Income + Tax Brackets in ONE flow === */}
        <Card size="sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">🧮 วิธีคำนวณภาษีแบบขั้นบันได</CardTitle>
          </CardHeader>
          <CardContent>
            {/* --- Section 1: Net Income Calculation --- */}
            <div className="space-y-1.5 text-sm">
              {/* Annual Income */}
              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground">รายได้ทั้งปี</span>
                <span className="font-medium tabular-nums">
                  {fmt(result.annualIncome)} บาท
                </span>
              </div>

              {/* Expenses */}
              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground">- ค่าใช้จ่าย</span>
                <span className="font-medium tabular-nums text-red-500">
                  {fmt(result.expenses)} บาท
                </span>
              </div>

              {/* Deductions */}
              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground">- ค่าลดหย่อน</span>
                <span className="font-medium tabular-nums text-red-500">
                  {fmt(result.totalDeductions)} บาท
                </span>
              </div>

              {/* Divider + Net Income */}
              <div className="border-t border-border my-2" />
              <div className="flex items-center justify-between py-1.5">
                <span className="font-semibold">รายได้สุทธิเพื่อคำนวณภาษี</span>
                <span className="font-bold tabular-nums">
                  {fmt(result.netIncome)} บาท
                </span>
              </div>
            </div>

            {/* --- Section 2: Tax Brackets --- */}
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-[11px] text-muted-foreground mb-3">
                นำเงินได้สุทธิ {fmt(result.netIncome)} บาท ไปคิดภาษีทีละขั้น
              </p>

              <div className="space-y-1.5 text-sm">
                {result.breakdown
                  .filter((b) => b.tax > 0 || result.netIncome > b.amount)
                  .map((bracket, i) => {
                    const isExempt = bracket.tax === 0 && bracket.amount === 0;
                    return (
                      <div
                        key={bracket.step}
                        className="flex items-center justify-between py-1"
                      >
                        <span className="text-muted-foreground">
                          {bracket.step}: {bracket.range}
                        </span>
                        {isExempt ? (
                          <span className="text-muted-foreground text-xs">
                            ยกเว้น
                          </span>
                        ) : bracket.tax > 0 ? (
                          <span className="font-medium tabular-nums text-red-500">
                            {fmt(bracket.amount)} × {bracket.rate} ={" "}
                            {fmt(Math.round(bracket.tax))} บาท
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            -
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Divider + Total Tax */}
              <div className="border-t border-border my-2" />
              <div className="flex items-center justify-between py-1.5">
                <span className="font-semibold">รวมภาษีที่ต้องจ่าย</span>
                <span className="font-bold tabular-nums text-red-500 text-base">
                  {fmt(Math.round(totalTax))} บาท
                </span>
              </div>
            </div>

            {/* --- Monthly average --- */}
            <div className="mt-2 text-center">
              <span className="text-[11px] text-muted-foreground">
                เฉลี่ยภาษีต่อเดือน ≈{" "}
                <span className="font-medium text-foreground">
                  {fmt(Math.round(totalTax / 12))} บาท
                </span>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Deduction breakdown */}
        <Card size="sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              📋 รายละเอียดค่าลดหย่อน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ค่าลดหย่อนส่วนตัว</span>
                <span>60,000</span>
              </div>
              {pvd > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    กองทุนสำรองเลี้ยงชีพ (PVD)
                  </span>
                  <span>{fmt(pvd)}</span>
                </div>
              )}
              {socialSecurity > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ประกันสังคม</span>
                  <span>{fmt(socialSecurity)}</span>
                </div>
              )}
              {lifeInsurance > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ประกันชีวิต</span>
                  <span>{fmt(lifeInsurance)}</span>
                </div>
              )}
              {donation > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">เงินบริจาค</span>
                  <span>{fmt(donation)}</span>
                </div>
              )}
              {otherDeductions > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">อื่นๆ</span>
                  <span>{fmt(otherDeductions)}</span>
                </div>
              )}
              <div className="border-t pt-1.5 flex justify-between font-medium">
                <span>รวมค่าลดหย่อน</span>
                <span>{fmt(result.totalDeductions)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax refund hint */}
        {result.annualTax > 0 && (
          <Card size="sm" className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
            <CardContent className="py-3">
              <p className="text-xs text-green-800 dark:text-green-200">
                💡 ถ้าถูกหักภาษี ณ ที่จ่ายเกิน{" "}
                {fmt(Math.round(result.annualTax))} บาท จะได้รับเงินคืนในปีถัดไป
              </p>
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <p className="text-center text-[11px] text-muted-foreground pb-4">
          * อัตราภาษีอิงตามกฎหมายภาษีเงินได้บุคคลธรรมดาล่าสุด
        </p>
      </div>
    </div>
  );
}
