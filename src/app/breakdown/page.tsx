"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaxContext } from "@/lib/TaxContext";
import { PieChart } from "lucide-react";

function fmt(n: number): string {
  return n.toLocaleString("th-TH");
}

export default function BreakdownPage() {
  const { state } = useTaxContext();
  const { input, result } = state;
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
              ข้อมูลจากหน้า "คำนวณภาษี" · แสดงวิธีคิดแบบขั้นบันได
            </p>
          </div>
        </div>

        {/* === MAIN CARD: Net Income + Tax Brackets === */}
        <Card size="sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">🧮 วิธีคำนวณภาษีแบบขั้นบันได</CardTitle>
          </CardHeader>
          <CardContent>
            {/* --- Section 1: Net Income Calculation --- */}
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground">รายได้ทั้งปี</span>
                <span className="font-medium tabular-nums">
                  {fmt(result.annualIncome)} บาท
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground">- ค่าใช้จ่าย</span>
                <span className="font-medium tabular-nums text-red-500">
                  {fmt(result.expenses)} บาท
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground">- ค่าลดหย่อน</span>
                <span className="font-medium tabular-nums text-red-500">
                  {fmt(result.totalDeductions)} บาท
                </span>
              </div>
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
                  .map((bracket) => {
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
              <div className="border-t border-border my-2" />
              <div className="flex items-center justify-between py-1.5">
                <span className="font-semibold">รวมภาษีที่ต้องจ่าย</span>
                <span className="font-bold tabular-nums text-red-500 text-base">
                  {fmt(Math.round(totalTax))} บาท
                </span>
              </div>
            </div>

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
            <CardTitle className="text-sm">📋 รายละเอียดค่าลดหย่อน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ค่าลดหย่อนส่วนตัว</span>
                <span>60,000</span>
              </div>
              {input.providentFund > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">กองทุนสำรองเลี้ยงชีพ (PVD)</span>
                  <span>{fmt(input.providentFund)}</span>
                </div>
              )}
              {input.socialSecurity > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ประกันสังคม</span>
                  <span>{fmt(input.socialSecurity)}</span>
                </div>
              )}
              {input.lifeInsurance > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ประกันชีวิต</span>
                  <span>{fmt(input.lifeInsurance)}</span>
                </div>
              )}
              {input.healthInsurance > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ประกันสุขภาพ</span>
                  <span>{fmt(input.healthInsurance)}</span>
                </div>
              )}
              {input.donation > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">เงินบริจาค</span>
                  <span>{fmt(input.donation)}</span>
                </div>
              )}
              {input.retirementFund > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RMF/SSF</span>
                  <span>{fmt(input.retirementFund)}</span>
                </div>
              )}
              {input.parentCare > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">เลี้ยงดูบิดามารดา</span>
                  <span>{fmt(input.parentCare)}</span>
                </div>
              )}
              {(input.children ?? 0) > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">บุตร ({input.children} คน)</span>
                  <span>{fmt((input.children ?? 0) * 30000)}</span>
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

        <p className="text-center text-[11px] text-muted-foreground pb-4">
          * อัตราภาษีอิงตามกฎหมายภาษีเงินได้บุคคลธรรมดาล่าสุด
        </p>
      </div>
    </div>
  );
}
