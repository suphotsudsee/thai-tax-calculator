"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaxResultCard } from "@/components/TaxResultCard";
import {
  calculateTax,
  getDefaultInput,
  TaxInput,
  TaxResult,
} from "@/lib/tax-calculator";
import {
  Calculator,
  RotateCcw,
} from "lucide-react";

export default function CalculatorPage() {
  const [input, setInput] = useState<TaxInput>(getDefaultInput());
  const [result, setResult] = useState<TaxResult | null>(null);
  const [activeTab, setActiveTab] = useState("income");

  const updateField = useCallback(
    <K extends keyof TaxInput>(key: K, value: TaxInput[K]) => {
      setInput((prev) => {
        const next = { ...prev, [key]: value };
        const result = calculateTax(next);
        setResult(result);
        return next;
      });
    },
    []
  );

  const handleNumberChange = useCallback(
    (key: keyof TaxInput, raw: string) => {
      const value = raw === "" ? 0 : Number(raw);
      if (!isNaN(value) && value >= 0) {
        updateField(key, value);
      }
    },
    [updateField]
  );

  const handleReset = () => {
    const defaults = getDefaultInput();
    setInput(defaults);
    setResult(calculateTax(defaults));
  };

  // Initial calculation on mount already handled by useState

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-lg px-4 py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">คำนวณภาษี</h1>
            <p className="text-xs text-muted-foreground">
              กรอกข้อมูลให้ครบเพื่อผลลัพธ์ที่แม่นยำ
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">รีเซ็ต</span>
          </Button>
        </div>

        {/* Form in Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList variant="default" className="w-full">
            <TabsTrigger value="income" className="flex-1 text-xs">
              รายได้
            </TabsTrigger>
            <TabsTrigger value="deductions" className="flex-1 text-xs">
              ลดหย่อน
            </TabsTrigger>
            <TabsTrigger value="extra" className="flex-1 text-xs">
              เพิ่มเติม
            </TabsTrigger>
          </TabsList>

          {/* Income Tab */}
          <TabsContent value="income" className="mt-4">
            <Card size="sm">
              <CardHeader>
                <CardTitle className="text-sm">ข้อมูลรายได้</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label>เงินเดือน (บาท/เดือน)</Label>
                  <Input
                    type="number"
                    value={input.monthlySalary || ""}
                    onChange={(e) =>
                      handleNumberChange("monthlySalary", e.target.value)
                    }
                    placeholder="30000"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>โบนัส (บาท/เดือน)</Label>
                    <Input
                      type="number"
                      value={input.bonus || ""}
                      onChange={(e) =>
                        handleNumberChange("bonus", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>จำนวนเดือนโบนัส</Label>
                    <Select
                      value={String(input.bonusMonths)}
                      onValueChange={(v) =>
                        updateField("bonusMonths", Number(v))
                      }
                    >
                      <SelectTrigger size="sm" className="w-full">
                        <SelectValue placeholder="เลือก" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 0.5, 1, 1.5, 2, 3, 4, 5, 6].map((m) => (
                          <SelectItem key={m} value={String(m)}>
                            {m} เดือน
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>จำนวนเดือนที่ทำงานในปี</Label>
                  <Select
                    value={String(input.monthsWorked)}
                    onValueChange={(v) =>
                      updateField("monthsWorked", Number(v))
                    }
                  >
                    <SelectTrigger size="sm" className="w-full">
                      <SelectValue placeholder="เลือก" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (m) => (
                          <SelectItem key={m} value={String(m)}>
                            {m} เดือน
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deductions Tab */}
          <TabsContent value="deductions" className="mt-4">
            <Card size="sm">
              <CardHeader>
                <CardTitle className="text-sm">ค่าลดหย่อน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label>ประกันสังคม (บาท/ปี, สูงสุด 9,000)</Label>
                  <Input
                    type="number"
                    value={input.socialSecurity || ""}
                    onChange={(e) =>
                      handleNumberChange("socialSecurity", e.target.value)
                    }
                    placeholder="9000"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>กองทุนสำรองเลี้ยงชีพ (บาท/ปี)</Label>
                  <Input
                    type="number"
                    value={input.providentFund || ""}
                    onChange={(e) =>
                      handleNumberChange("providentFund", e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>ประกันชีวิต (สูงสุด 100,000)</Label>
                    <Input
                      type="number"
                      value={input.lifeInsurance || ""}
                      onChange={(e) =>
                        handleNumberChange("lifeInsurance", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>ประกันสุขภาพ (สูงสุด 25,000)</Label>
                    <Input
                      type="number"
                      value={input.healthInsurance || ""}
                      onChange={(e) =>
                        handleNumberChange("healthInsurance", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>RMF/SSF กองทุนเพื่อการเกษียณ (บาท/ปี)</Label>
                  <Input
                    type="number"
                    value={input.retirementFund || ""}
                    onChange={(e) =>
                      handleNumberChange("retirementFund", e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>เลี้ยงดูบิดามารดา (สูงสุด 60,000)</Label>
                    <Input
                      type="number"
                      value={input.parentCare || ""}
                      onChange={(e) =>
                        handleNumberChange("parentCare", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>คู่สมรสไม่มีรายได้</Label>
                    <Input
                      type="number"
                      value={input.spouseCare || ""}
                      onChange={(e) =>
                        handleNumberChange("spouseCare", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>เงินบริจาค (บาท/ปี)</Label>
                  <Input
                    type="number"
                    value={input.donation || ""}
                    onChange={(e) =>
                      handleNumberChange("donation", e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>จำนวนบุตร</Label>
                  <Select
                    value={String(input.children)}
                    onValueChange={(v) =>
                      updateField("children", Number(v))
                    }
                  >
                    <SelectTrigger size="sm" className="w-full">
                      <SelectValue placeholder="เลือก" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n} คน
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>ค่าเล่าเรียนบุตร (บาท/ปี)</Label>
                  <Input
                    type="number"
                    value={input.childrenEducation || ""}
                    onChange={(e) =>
                      handleNumberChange("childrenEducation", e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Extra Tab */}
          <TabsContent value="extra" className="mt-4">
            <Card size="sm">
              <CardHeader>
                <CardTitle className="text-sm">ข้อมูลเพิ่มเติม</CardTitle>
                <CardDescription>
                  ข้อมูลส่วนบุคคลที่มีผลต่อการคำนวณภาษี
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">มีคู่สมรส</Label>
                    <p className="text-[10px] text-muted-foreground">
                      คู่สมรสไม่มีรายได้
                    </p>
                  </div>
                  <Select
                    value={input.hasSpouse ? "yes" : "no"}
                    onValueChange={(v) =>
                      updateField("hasSpouse", v === "yes")
                    }
                  >
                    <SelectTrigger size="sm" className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">ไม่มี</SelectItem>
                      <SelectItem value="yes">มี</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">อายุเกิน 65 ปี</Label>
                    <p className="text-[10px] text-muted-foreground">
                      ได้รับยกเว้นเพิ่ม 190,000 บาท
                    </p>
                  </div>
                  <Select
                    value={input.isOver65 ? "yes" : "no"}
                    onValueChange={(v) =>
                      updateField("isOver65", v === "yes")
                    }
                  >
                    <SelectTrigger size="sm" className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">ไม่ใช่</SelectItem>
                      <SelectItem value="yes">ใช่</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>ลดหย่อนอื่นๆ (บาท/ปี)</Label>
                  <Input
                    type="number"
                    value={input.otherDeductions || ""}
                    onChange={(e) =>
                      handleNumberChange("otherDeductions", e.target.value)
                    }
                    placeholder="0"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    รายการลดหย่อนอื่นๆ ที่ไม่รวมในหมวดข้างต้น
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Result */}
        {result && <TaxResultCard result={result} />}

        {/* Info */}
        <div className="rounded-lg bg-blue-500/5 p-3 text-center">
          <p className="text-[11px] text-muted-foreground">
            💡 ตัวเลขที่แสดงเป็นตัวเลขโดยประมาณ อิงตามอัตราภาษีเงินได้บุคคลธรรมดาล่าสุด
            กรุณาตรวจสอบกับผู้เชี่ยวชาญด้านภาษีก่อนยื่นแบบ
          </p>
        </div>
      </div>
    </div>
  );
}
