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

/** Strip non-digits and leading zeros — leave "0" if result is empty */
function cleanNumeric(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const cleaned = digits.replace(/^0+(?=\d)/, ""); // strip leading zeros but keep "0"
  return cleaned;
}

export default function CalculatorPage() {
  const { state, setNumber, updateInput, resetInput } = useTaxContext();
  const { input, result } = state;
  const [tab, setTab] = useState("income");

  const handleNumberChange = useCallback(
    (key: keyof TaxInput, raw: string) => {
      const cleaned = cleanNumeric(raw);
      const value = cleaned === "" ? 0 : Number(cleaned);
      setNumber(key, value);
    },
    [setNumber]
  );

  const inputProps = (key: keyof TaxInput, placeholder = "0") => ({
    type: "text",
    inputMode: "numeric" as const,
    value: input[key] === 0 ? "" : String(input[key] || ""),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      handleNumberChange(key, e.target.value),
    placeholder,
  });

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
                  <Input {...inputProps("monthlySalary")} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>โบนัส (บาท)</Label>
                    <Input {...inputProps("bonus")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>จำนวนเดือนโบนัส</Label>
                    <Input {...inputProps("bonusMonths", "1")} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>จำนวนเดือนที่ทำงาน</Label>
                  <Input {...inputProps("monthsWorked", "12")} />
                </div>
              </TabsContent>

              {/* Deductions Tab */}
              <TabsContent value="deductions" className="space-y-3">
                <div className="space-y-1.5">
                  <Label>ประกันสังคม (บาท/ปี, สูงสุด 9,000)</Label>
                  <Input {...inputProps("socialSecurity")} />
                </div>
                <div className="space-y-1.5">
                  <Label>กองทุนสำรองเลี้ยงชีพ (บาท/ปี)</Label>
                  <Input {...inputProps("providentFund")} />
                </div>
                <div className="space-y-1.5">
                  <Label>ประกันชีวิต (บาท/ปี)</Label>
                  <Input {...inputProps("lifeInsurance")} />
                </div>
                <div className="space-y-1.5">
                  <Label>ประกันสุขภาพ (บาท/ปี)</Label>
                  <Input {...inputProps("healthInsurance")} />
                </div>
              </TabsContent>

              {/* Extra Tab */}
              <TabsContent value="extra" className="space-y-3">
                <div className="space-y-1.5">
                  <Label>เลี้ยงดูบิดามารดา (บาท/ปี)</Label>
                  <Input {...inputProps("parentCare")} />
                </div>
                <div className="space-y-1.5">
                  <Label>จำนวนบุตร</Label>
                  <Input {...inputProps("children")} />
                </div>
                <div className="space-y-1.5">
                  <Label>RMF/SSF (บาท/ปี)</Label>
                  <Input {...inputProps("retirementFund")} />
                </div>
                <div className="space-y-1.5">
                  <Label>เงินบริจาค (บาท/ปี)</Label>
                  <Input {...inputProps("donation")} />
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
                  <Input {...inputProps("otherDeductions")} />
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
