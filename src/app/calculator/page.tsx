"use client";

import { useCallback, useState } from "react";
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
import { TaxInput } from "@/lib/tax-calculator";
import { useTaxContext } from "@/lib/TaxContext";
import {
  Calculator,
  RotateCcw,
} from "lucide-react";

export default function CalculatorPage() {
  const { state, setNumber, updateInput, resetInput } = useTaxContext();
  const { input, result } = state;
  const [tab, setTab] = useState("income");

  const handleNumberChange = useCallback(
    (key: keyof TaxInput, raw: string) => {
      const value = raw === "" ? 0 : Number(raw);
      if (!isNaN(value) && value >= 0) {
        setNumber(key, value);
      }
    },
    [setNumber]
  );

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto max-w-lg px-4 py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
              <Calculator className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">คำนวณภาษี</h1>
              <p className="text-xs text-muted-foreground">
                กรอกข้อมูลเพื่อคำนวณภาษีที่ต้องจ่าย
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={resetInput}>
            <RotateCcw className="size-3.5 mr-1" />
            รีเซ็ต
          </Button>
        </div>

        {/* Input Form */}
        <Card size="sm">
          <CardHeader>
            <CardTitle className="text-sm">ข้อมูลสำหรับคำนวณ</CardTitle>
            <CardDescription className="text-[11px]">
              เปลี่ยนแปลงค่าเพื่อดูผลลัพธ์ทันที
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="w-full mb-3">
                <TabsTrigger value="income" className="flex-1 text-[11px]">
                  รายได้
                </TabsTrigger>
                <TabsTrigger value="deductions" className="flex-1 text-[11px]">
                  ลดหย่อน
                </TabsTrigger>
                <TabsTrigger value="extra" className="flex-1 text-[11px]">
                  เพิ่มเติม
                </TabsTrigger>
              </TabsList>

              {/* Income Tab */}
              <TabsContent value="income" className="space-y-3">
                <div className="space-y-1.5">
                  <Label>เงินเดือน (บาท/เดือน)</Label>
                  <Input
                    type="number"
                    value={input.monthlySalary || ""}
                    onChange={(e) =>
                      handleNumberChange("monthlySalary", e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>โบนัส (บาท)</Label>
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
                    <Input
                      type="number"
                      value={input.bonusMonths || ""}
                      onChange={(e) =>
                        handleNumberChange("bonusMonths", e.target.value)
                      }
                      placeholder="1"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>จำนวนเดือนที่ทำงาน</Label>
                  <Input
                    type="number"
                    value={input.monthsWorked || ""}
                    onChange={(e) =>
                      handleNumberChange("monthsWorked", e.target.value)
                    }
                    placeholder="12"
                  />
                </div>
              </TabsContent>

              {/* Deductions Tab */}
              <TabsContent value="deductions" className="space-y-3">
                <div className="space-y-1.5">
                  <Label>ประกันสังคม (บาท/ปี, สูงสุด 9,000)</Label>
                  <Input
                    type="number"
                    value={input.socialSecurity || ""}
                    onChange={(e) =>
                      handleNumberChange("socialSecurity", e.target.value)
                    }
                    placeholder="0"
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
                <div className="space-y-1.5">
                  <Label>ประกันชีวิต (บาท/ปี)</Label>
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
                  <Label>ประกันสุขภาพ (บาท/ปี)</Label>
                  <Input
                    type="number"
                    value={input.healthInsurance || ""}
                    onChange={(e) =>
                      handleNumberChange("healthInsurance", e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
              </TabsContent>

              {/* Extra Tab */}
              <TabsContent value="extra" className="space-y-3">
                <div className="space-y-1.5">
                  <Label>เลี้ยงดูบิดามารดา (บาท/ปี)</Label>
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
                  <Label>จำนวนบุตร</Label>
                  <Input
                    type="number"
                    value={input.children || ""}
                    onChange={(e) =>
                      handleNumberChange("children", e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>RMF/SSF (บาท/ปี)</Label>
                  <Input
                    type="number"
                    value={input.retirementFund || ""}
                    onChange={(e) =>
                      handleNumberChange("retirementFund", e.target.value)
                    }
                    placeholder="0"
                  />
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
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="hasSpouse"
                      checked={input.hasSpouse}
                      onChange={(e) =>
                        updateInput({ hasSpouse: e.target.checked })
                      }
                      className="rounded"
                    />
                    <Label htmlFor="hasSpouse" className="text-xs">
                      มีคู่สมรส
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isOver65"
                      checked={input.isOver65}
                      onChange={(e) =>
                        updateInput({ isOver65: e.target.checked })
                      }
                      className="rounded"
                    />
                    <Label htmlFor="isOver65" className="text-xs">
                      อายุเกิน 65
                    </Label>
                  </div>
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
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Results */}
        <TaxResultCard result={result} />
      </div>
    </div>
  );
}
