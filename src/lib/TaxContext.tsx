"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import {
  TaxInput,
  TaxResult,
  getDefaultInput,
  calculateTax,
} from "@/lib/tax-calculator";

interface TaxState {
  input: TaxInput;
  result: TaxResult;
}

interface TaxContextType {
  state: TaxState;
  updateInput: (patch: Partial<TaxInput>) => void;
  resetInput: () => void;
  setNumber: (key: keyof TaxInput, value: number) => void;
}

const TaxContext = createContext<TaxContextType | null>(null);

export function TaxProvider({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState<TaxInput>(getDefaultInput());

  const result = useMemo(() => calculateTax(input), [input]);

  const state = useMemo<TaxState>(() => ({ input, result }), [input, result]);

  const updateInput = useCallback((patch: Partial<TaxInput>) => {
    setInput((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetInput = useCallback(() => {
    setInput(getDefaultInput());
  }, []);

  const setNumber = useCallback((key: keyof TaxInput, value: number) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <TaxContext value={{ state, updateInput, resetInput, setNumber }}>
      {children}
    </TaxContext>
  );
}

export function useTaxContext() {
  const ctx = useContext(TaxContext);
  if (!ctx) throw new Error("useTaxContext must be used inside TaxProvider");
  return ctx;
}
