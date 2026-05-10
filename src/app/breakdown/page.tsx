"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BracketChart } from "@/components/BracketChart";
import {
  calculateTax,
  getDefaultInput,
  TaxInput,
  TaxResult,
} from "@/lib/tax-calculator";
import { PieChart, Minus, Equal } from "lucide-react";

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

        {/* HOW TO CALCULATE NET INCOME — like the post */}
        <Card size="sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-1.5">
              🧮 วิธีหาเงินได้สุทธิ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Step 1: Annual Income */}
            <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-md bg-muted/30">
              <span className="text-muted-foreground">รายได้ทั้งปี</span>
              <span className="font-medium">
                ({salary.toLocaleString("th-TH")} × 12
                {bonus > 0
                  ? ` + ${bonus.toLocaleString("th-TH")} × ${bonusMonths}`
                  : ""}
                )
              </span>
            </div>

            <div className="flex justify-center">
              <Minus className="size-3 text-muted-foreground" />
            </div>

            {/* Step 2: Expenses */}
            <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-md bg-muted/30">
              <span className="text-muted-foreground">
                หักค่าใช้จ่าย (50%, สูงสุด 100,000)
              </span>
              <span className="font-medium">
                {result.expenses.toLocaleString("th-TH")}
              </span>
            </div>

            <div className="flex justify-center">
              <Minus className="size-3 text-muted-foreground" />
            </div>

            {/* Step 3: Deductions */}
            <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-md bg-muted/30">
              <span className="text-muted-foreground">
                หักค่าลดหย่อน (ส่วนตัว + อื่นๆ)
              </span>
              <span className="font-medium">
                {result.totalDeductions.toLocaleString("th-TH")}
              </span>
            </div>

            <div className="flex justify-center">
              <Equal className="size-3 text-primary" />
            </div>

            {/* Result: Net Income */}
            <div className="flex items-center justify-between text-sm py-2 px-3 rounded-md bg-primary/5 border border-primary/20 font-bold">
              <span>เงินได้สุทธิ</span>
              <span className="text-primary">
                {result.netIncome.toLocaleString("th-TH")} บาท
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
                  <span>{pvd.toLocaleString("th-TH")}</span>
                </div>
              )}
              {socialSecurity > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ประกันสังคม</span>
                  <span>{socialSecurity.toLocaleString("th-TH")}</span>
                </div>
              )}
              {lifeInsurance > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ประกันชีวิต</span>
                  <span>{lifeInsurance.toLocaleString("th-TH")}</span>
                </div>
              )}
              {donation > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">เงินบริจาค</span>
                  <span>{donation.toLocaleString("th-TH")}</span>
                </div>
              )}
              {otherDeductions > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">อื่นๆ</span>
                  <span>{otherDeductions.toLocaleString("th-TH")}</span>
                </div>
              )}
              <div className="border-t pt-1.5 flex justify-between font-medium">
                <span>รวมค่าลดหย่อน</span>
                <span>{result.totalDeductions.toLocaleString("th-TH")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* THE MAIN EVENT — Step-by-step tax brackets */}
        <Card size="sm">
          <CardContent className="pt-4">
            <BracketChart
              breakdown={result.breakdown}
              netIncome={result.netIncome}
            />
          </CardContent>
        </Card>

        {/* Tax refund hint */}
        {result.annualTax > 0 && (
          <Card size="sm" className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
            <CardContent className="py-3">
              <p className="text-xs text-green-800 dark:text-green-200">
                💡 ถ้าถูกหักภาษี ณ ที่จ่ายเกิน {result.annualTax.toLocaleString("th-TH")} บาท 
                จะได้รับเงินคืนในปีถัดไป
              </p>
            </CardContent>
          </Card>
        )}

        {/* Disclaimer */}
        <p className="text-center text-[11px] text-muted-foreground pb-4">
          * อัตราภาษีอิงตามกฎหมายภาษีเงินได้บุคคลธรรมดาล่าสุด ตัวเลขอาจ
          คลาดเคลื่อนเล็กน้อยจากการปัดเศษ
        </p>
      </div>
    </div>
  );
}
