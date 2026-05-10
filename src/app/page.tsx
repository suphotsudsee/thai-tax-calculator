"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TaxResultCard } from "@/components/TaxResultCard";
import {
  calculateTax,
  getDefaultInput,
  TaxResult,
  formatCurrencyTHBShort,
} from "@/lib/tax-calculator";
import {
  ArrowRight,
  Calculator,
  TrendingUp,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  const [salary, setSalary] = useState(30000);
  const [quickResult, setQuickResult] = useState<TaxResult | null>(null);

  const handleQuickCalc = () => {
    const input = { ...getDefaultInput(), monthlySalary: salary };
    const result = calculateTax(input);
    setQuickResult(result);
  };

  const features = [
    {
      icon: Zap,
      title: "คำนวณทันที",
      description: "กรอกเงินเดือนแล้วรู้ผลภาษีทันที ไม่ต้องรอ",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: TrendingUp,
      title: "อัตราก้าวหน้า",
      description: "คำนวณตามขั้นบันไดภาษี 8 ขั้น ตามกฎหมายล่าสุด",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      icon: ShieldCheck,
      title: "ลดหย่อนครบ",
      description: "รวมค่าลดหย่อนครบทุกรายการ มนุษย์เงินเดือนต้องรู้",
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-lg px-4 py-8 space-y-6">
        {/* Hero Section */}
        <section className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 mb-2">
            <Calculator className="size-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            คำนวณภาษีเงินเดือน
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            เครื่องมือคำนวณภาษีเงินได้บุคคลธรรมดาสำหรับมนุษย์เงินเดือน
            คำนวณง่าย แม่นยำ รู้ผลทันที
          </p>
        </section>

        {/* Quick Calculator Card */}
        <Card className="border-2 border-blue-500/20 shadow-lg shadow-blue-500/5 dark:border-blue-500/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="size-4 text-blue-500" />
              คำนวณภาษีด่วน
            </CardTitle>
            <CardDescription>
              กรอกเงินเดือนแล้วกดคำนวณเพื่อดูภาษีเบื้องต้น
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="quick-salary">เงินเดือน (บาท/เดือน)</Label>
              <Input
                id="quick-salary"
                type="number"
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                placeholder="เช่น 30000"
                className="text-base font-medium"
              />
            </div>
            <Button
              onClick={handleQuickCalc}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20"
              size="lg"
            >
              คำนวณภาษี
              <ArrowRight className="size-4" />
            </Button>

            {quickResult && (
              <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="rounded-lg bg-gradient-to-r from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      ภาษีต่อปี
                    </span>
                    <span className="text-lg font-bold text-foreground">
                      {formatCurrencyTHBShort(quickResult.annualTax)} บาท
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      ภาษีต่อเดือน
                    </span>
                    <span className="font-medium text-sm">
                      {formatCurrencyTHBShort(quickResult.monthlyTax)} บาท
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      อัตราภาษีที่แท้จริง
                    </span>
                    <span className="font-medium text-sm text-blue-600 dark:text-blue-400">
                      {quickResult.effectiveTaxRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <section>
          <h2 className="text-sm font-semibold mb-3 px-1">
            ทำไมต้องใช้เครื่องมือนี้?
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  size="sm"
                  className="text-center group hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-1">
                    <div
                      className={`mx-auto size-9 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-md mb-1`}
                    >
                      <Icon className="size-4 text-white" />
                    </div>
                    <CardTitle className="text-xs font-semibold leading-tight">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-2 pb-4">
          <Link href="/calculator">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/25 px-8 text-base font-semibold"
            >
              เริ่มคำนวณเลย
              <ArrowRight className="size-5" />
            </Button>
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">
            คำนวณละเอียดพร้อมค่าลดหย่อนครบทุกรายการ
          </p>
        </div>
      </div>
    </div>
  );
}
