// Thai Personal Income Tax Calculator (2026)
// อัตราภาษีเงินได้บุคคลธรรมดาแบบก้าวหน้า

export interface TaxInput {
  monthlySalary: number;
  bonus: number;
  bonusMonths: number;
  socialSecurity: number;       // ประกันสังคม (max 9,000/ปี)
  providentFund: number;        // กองทุนสำรองเลี้ยงชีพ
  lifeInsurance: number;        // ประกันชีวิต
  healthInsurance: number;      // ประกันสุขภาพ
  parentCare: number;           // เลี้ยงดูบิดามารดา
  children: number;             // จำนวนบุตร (0, 1, 2, ...)
  childrenEducation: number;    // ค่าเล่าเรียนบุตร
  spouseCare: number;           // คู่สมรสไม่มีรายได้
  donation: number;             // เงินบริจาค
  retirementFund: number;       // RMF/SSF
  otherDeductions: number;      // ลดหย่อนอื่นๆ
  hasSpouse: boolean;           // มีคู่สมรส
  isOver65: boolean;            // อายุเกิน 65
  monthsWorked: number;         // จำนวนเดือนที่ทำงาน (default 12)
}

export interface TaxBreakdown {
  step: string;
  range: string;
  rate: string;
  amount: number;
  tax: number;
}

export interface TaxResult {
  annualIncome: number;
  expenses: number;
  totalDeductions: number;
  netIncome: number;
  annualTax: number;
  monthlyTax: number;
  netMonthlyAfterTax: number;
  effectiveTaxRate: number;
  breakdown: TaxBreakdown[];
  isExempt: boolean;
  thresholdMet: boolean;
}

const TAX_BRACKETS = [
  { min: 0, max: 150000, rate: 0 },
  { min: 150001, max: 300000, rate: 0.05 },
  { min: 300001, max: 500000, rate: 0.10 },
  { min: 500001, max: 750000, rate: 0.15 },
  { min: 750001, max: 1000000, rate: 0.20 },
  { min: 1000001, max: 2000000, rate: 0.25 },
  { min: 2000001, max: 5000000, rate: 0.30 },
  { min: 5000001, max: Infinity, rate: 0.35 },
];

function formatCurrency(amount: number): string {
  return amount.toLocaleString('th-TH', { maximumFractionDigits: 0 });
}

export function calculateTax(input: TaxInput): TaxResult {
  const {
    monthlySalary,
    bonus,
    bonusMonths,
    socialSecurity,
    providentFund,
    lifeInsurance,
    healthInsurance,
    parentCare,
    children,
    childrenEducation,
    spouseCare,
    donation,
    retirementFund,
    otherDeductions,
    hasSpouse,
    isOver65,
    monthsWorked = 12,
  } = input;

  // 1. Calculate annual income
  const salaryIncome = monthlySalary * monthsWorked;
  const bonusIncome = bonus * bonusMonths;
  const annualIncome = salaryIncome + bonusIncome;

  // 2. Expenses - 50% of income, max 100,000
  const expenses = Math.min(annualIncome * 0.5, 100000);

  // 3. Deductions
  let deductions = 0;

  // Personal deduction
  deductions += 60000;

  // Spouse (if no income)
  if (hasSpouse) {
    deductions += 60000;
  }

  // Over 65 deduction
  if (isOver65) {
    deductions += 190000;
  }

  // Children deduction (30,000 per child, max 3 for deduction)
  deductions += Math.min(children, 3) * 30000;

  // Children education (2,000 per child, max 3)
  if (children > 0) {
    deductions += Math.min(children, 3) * 2000;
  }

  // Additional children education
  deductions += Math.min(childrenEducation, 30000);

  // Parent care (max 30,000 per parent, max 60,000)
  deductions += Math.min(parentCare, 60000);

  // Spouse care
  deductions += Math.min(spouseCare, 60000);

  // Social security (max 9,000)
  deductions += Math.min(socialSecurity, 9000);

  // Life insurance (max 100,000)
  deductions += Math.min(lifeInsurance, 100000);

  // Health insurance (max 25,000)
  deductions += Math.min(healthInsurance, 25000);

  // Provident fund (max 500,000 or 15% of salary)
  const maxProvident = Math.min(500000, salaryIncome * 0.15);
  deductions += Math.min(providentFund, maxProvident);

  // Retirement fund (RMF/SSF combined max 500,000 or 30% of income)
  const maxRetirement = Math.min(500000, annualIncome * 0.30);
  deductions += Math.min(retirementFund, maxRetirement);

  // Donation (max 10% of net income after deductions)
  deductions += donation; // will clamp after we compute net income

  // Other deductions
  deductions += otherDeductions;

  // 4. Net income
  let netIncome = annualIncome - expenses - deductions;

  // Donation cap: 10% of (annualIncome - expenses - deductions + donation)
  // Recalculate with proper donation cap
  const deductionsWithoutDonation = deductions - donation;
  const netIncomeBeforeDonation = annualIncome - expenses - deductionsWithoutDonation;
  const maxDonation = Math.max(0, netIncomeBeforeDonation * 0.10);
  const actualDonation = Math.min(donation, maxDonation);

  const totalDeductions = deductionsWithoutDonation + actualDonation;
  netIncome = Math.max(0, annualIncome - expenses - totalDeductions);

  // 5. Calculate tax
  let annualTax = 0;
  const breakdown: TaxBreakdown[] = [];

  for (const bracket of TAX_BRACKETS) {
    if (netIncome <= bracket.min) {
      breakdown.push({
        step: `ขั้น ${TAX_BRACKETS.indexOf(bracket) + 1}`,
        range: `${formatCurrency(bracket.min)} - ${formatCurrency(bracket.max)}`,
        rate: `${(bracket.rate * 100).toFixed(0)}%`,
        amount: 0,
        tax: 0,
      });
      continue;
    }

    const taxableInBracket = Math.min(netIncome, bracket.max) - bracket.min;
    if (taxableInBracket <= 0) {
      breakdown.push({
        step: `ขั้น ${TAX_BRACKETS.indexOf(bracket) + 1}`,
        range: `${formatCurrency(bracket.min)} - ${formatCurrency(bracket.max)}`,
        rate: `${(bracket.rate * 100).toFixed(0)}%`,
        amount: 0,
        tax: 0,
      });
      continue;
    }

    const bracketTax = taxableInBracket * bracket.rate;
    annualTax += bracketTax;

    breakdown.push({
      step: `ขั้น ${TAX_BRACKETS.indexOf(bracket) + 1}`,
      range: `${formatCurrency(bracket.min)} - ${bracket.max === Infinity ? '∞' : formatCurrency(bracket.max)}`,
      rate: `${(bracket.rate * 100).toFixed(0)}%`,
      amount: taxableInBracket,
      tax: bracketTax,
    });
  }

  // 6. Monthly tax
  const monthlyTax = annualTax / 12;

  // 7. Net monthly after tax
  const netMonthlyAfterTax = monthlySalary - monthlyTax;

  // 8. Effective tax rate
  const effectiveTaxRate = annualIncome > 0 ? (annualTax / annualIncome) * 100 : 0;

  // 9. Threshold check
  const thresholdMet = monthlySalary > 26583.33;
  const isExempt = annualTax === 0;

  return {
    annualIncome: Math.round(annualIncome),
    expenses: Math.round(expenses),
    totalDeductions: Math.round(totalDeductions),
    netIncome: Math.round(netIncome),
    annualTax: Math.round(annualTax * 100) / 100,
    monthlyTax: Math.round(monthlyTax * 100) / 100,
    netMonthlyAfterTax: Math.round(netMonthlyAfterTax * 100) / 100,
    effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
    breakdown,
    isExempt,
    thresholdMet,
  };
}

export function getDefaultInput(): TaxInput {
  return {
    monthlySalary: 30000,
    bonus: 0,
    bonusMonths: 1,
    socialSecurity: 0,
    providentFund: 0,
    lifeInsurance: 0,
    healthInsurance: 0,
    parentCare: 0,
    children: 0,
    childrenEducation: 0,
    spouseCare: 0,
    donation: 0,
    retirementFund: 0,
    otherDeductions: 0,
    hasSpouse: false,
    isOver65: false,
    monthsWorked: 12,
  };
}

export function formatCurrencyTHB(amount: number): string {
  return amount.toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatCurrencyTHBShort(amount: number): string {
  return amount.toLocaleString('th-TH', { maximumFractionDigits: 0 });
}
