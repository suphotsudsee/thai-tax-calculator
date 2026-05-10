"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { TaxResultCard } from "@/components/TaxResultCard";
import {
  calculateTax,
  getDefaultInput,
  TaxInput,
  TaxResult,
  formatCurrencyTHBShort,
} from "@/lib/tax-calculator";
import {
  SlidersHorizontal,
  TrendingUp,
  DollarSign,
  Gift,
  Shield,
} from "lucide-react";

export default function SimulationPage() {
  const [salary, setSalary] = useState(30000);
  const [bonus, setBonus] = useState(0);
  const [bonusMonths, setBonusMonths] = useState(1);
  const [providentFund, setProvidentFund] = useState(0);
  const [lifeInsurance, setLifeInsurance] = useState(0);
  const [retirementFund, setRetirementFund] = useState(0);
  const [donation, setDonation] = useState(0);
  const [children, setChildren] = useState(0);

  const input: TaxInput = useMemo(
    () => ({
      ...getDefaultInput(),
      monthlySalary: salary,
      bonus,
      bonusMonths,
      providentFund,
      lifeInsurance,
      retirementFund,
      donation,
      children,
    }),
    [
      salary,
      bonus,
      bonusMonths,
      providentFund,
      lifeInsurance,
      retirementFund,
      donation,
      children,
    ]
  );

  const result: TaxResult = useMemo(() => calculateTax(input), [input]);

  // Comparison: current vs. without deductions
  const withoutDeductions: TaxResult = useMemo(
    () =>
      calculateTax({
        ...input,
        providentFund: 0,
        lifeInsurance: 0,
        retirementFund: 0,
        donation: 0,
        socialSecurity: 0,
        children: 0,
        parentCare: 0,
      }),
    [input]
  );

  const taxSaved =
    withoutDeductions.annualTax - result.annualTax;

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-lg px-4 py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-md">
            <SlidersHorizontal className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">จำลองสถานการณ์</h1>
            <p className="text-xs text-muted-foreground">
              ปรับค่าต่างๆ เพื่อดูผลกระทบต่อภาษีแบบเรียลไทม์
            </p>
          </div>
        </div>

        {/* Sliders Section */}
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="size-4 text-blue-500" />
              รายได้
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>เงินเดือน</Label>
                <span className="text-sm font-semibold tabular-nums">
                  {formatCurrencyTHBShort(salary)} บาท
                </span>
              </div>
              <Slider
                min={0}
                max={200000}
                step={1000}
                value={[salary]}
                onValueChange={(v) => setSalary(Array.isArray(v) ? v[0] : v)}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0</span>
                <span>200,000</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>โบนัส (ต่อเดือน)</Label>
                <span className="text-sm font-semibold tabular-nums">
                  {formatCurrencyTHBShort(bonus)} บาท
                </span>
              </div>
              <Slider
                min={0}
                max={200000}
                step={1000}
                value={[bonus]}
                onValueChange={(v) => setBonus(Array.isArray(v) ? v[0] : v)}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0</span>
                <span>200,000</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>จำนวนเดือนโบนัส</Label>
                <span className="text-sm font-semibold tabular-nums">
                  {bonusMonths} เดือน
                </span>
              </div>
              <Slider
                min={0}
                max={6}
                step={0.5}
                value={[bonusMonths]}
                onValueChange={(v) => setBonusMonths(Array.isArray(v) ? v[0] : v)}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0</span>
                <span>6</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="size-4 text-emerald-500" />
              ค่าลดหย่อน
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>กองทุนสำรองเลี้ยงชีพ</Label>
                <span className="text-sm font-semibold tabular-nums">
                  {formatCurrencyTHBShort(providentFund)} บาท
                </span>
              </div>
              <Slider
                min={0}
                max={500000}
                step={5000}
                value={[providentFund]}
                onValueChange={(v) => setProvidentFund(Array.isArray(v) ? v[0] : v)}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0</span>
                <span>500,000</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>ประกันชีวิต</Label>
                <span className="text-sm font-semibold tabular-nums">
                  {formatCurrencyTHBShort(lifeInsurance)} บาท
                </span>
              </div>
              <Slider
                min={0}
                max={100000}
                step={1000}
                value={[lifeInsurance]}
                onValueChange={(v) => setLifeInsurance(Array.isArray(v) ? v[0] : v)}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0</span>
                <span>100,000</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>RMF/SSF</Label>
                <span className="text-sm font-semibold tabular-nums">
                  {formatCurrencyTHBShort(retirementFund)} บาท
                </span>
              </div>
              <Slider
                min={0}
                max={500000}
                step={5000}
                value={[retirementFund]}
                onValueChange={(v) => setRetirementFund(Array.isArray(v) ? v[0] : v)}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0</span>
                <span>500,000</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>เงินบริจาค</Label>
                <span className="text-sm font-semibold tabular-nums">
                  {formatCurrencyTHBShort(donation)} บาท
                </span>
              </div>
              <Slider
                min={0}
                max={100000}
                step={1000}
                value={[donation]}
                onValueChange={(v) => setDonation(Array.isArray(v) ? v[0] : v)}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0</span>
                <span>100,000</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>จำนวนบุตร</Label>
                <span className="text-sm font-semibold tabular-nums">
                  {children} คน
                </span>
              </div>
              <Slider
                min={0}
                max={5}
                step={1}
                value={[children]}
                onValueChange={(v) => setChildren(Array.isArray(v) ? v[0] : v)}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0</span>
                <span>5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Cards */}
        <TaxResultCard result={result} />

        {/* Tax savings from deductions */}
        {taxSaved > 0 && (
          <Card
            size="sm"
            className="border-2 border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10"
          >
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Gift className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    คุณประหยัดภาษีได้
                  </p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrencyTHBShort(taxSaved)} บาท
                  </p>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                เมื่อเทียบกับการไม่ใช้ค่าลดหย่อนใดๆ เลย
                ภาษีของคุณลดลง {formatCurrencyTHBShort(taxSaved)} บาทต่อปี
              </p>
            </CardContent>
          </Card>
        )}

        {/* Before/After comparison */}
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm">เปรียบเทียบ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-red-500/5 p-3 text-center">
                <p className="text-[10px] text-muted-foreground">
                  ไม่มีค่าลดหย่อน
                </p>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                  {formatCurrencyTHBShort(withoutDeductions.annualTax)}
                </p>
                <p className="text-[10px] text-muted-foreground">บาท/ปี</p>
              </div>
              <div className="rounded-lg bg-emerald-500/5 p-3 text-center">
                <p className="text-[10px] text-muted-foreground">
                  มีค่าลดหย่อน
                </p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrencyTHBShort(result.annualTax)}
                </p>
                <p className="text-[10px] text-muted-foreground">บาท/ปี</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <p className="text-center text-[11px] text-muted-foreground pb-4">
          💡 ลองปรับค่าต่างๆ ด้านบนเพื่อดูผลกระทบต่อภาษีแบบเรียลไทม์
        </p>
      </div>
    </div>
  );
}
