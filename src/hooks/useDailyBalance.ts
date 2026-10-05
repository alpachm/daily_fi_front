// src/hooks/useDailyBalance.ts
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { CreateDailyBalanceService } from "../services/CreateDailyBalanceService";
import {
    CreateDailyBalanceApiError,
    type CreateDailyBalancePayload,
} from "../interfaces/CreateDailyBalanceService.interface";
import { getTodayIsoDate } from "../utils/date";
import type { DailyBalanceData } from "../interfaces/DailyBalance.interface";

export type BalanceBlock = "previous" | "today";
export type BalanceField = "started" | "finished";
export type BalanceTone = "positive" | "negative" | "neutral";

export interface AmountFieldState {
  value: number;
  draft: string;
  isEditing: boolean;
}

export interface DayBlockState {
  started: AmountFieldState;
  finished: AmountFieldState;
}

const MOCK_PREVIOUS_DAY = {
  started: 1000,
  finished: 1150,
} as const;

const createInitialField = (value: number, isEditing = false): AmountFieldState => ({
  value,
  draft: "",
  isEditing,
});

const parseAmount = (raw: string): number => {
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
};

const isValidAmount = (raw: string): boolean => {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return false;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0;
};

const effectiveValue = (field: AmountFieldState): number =>
  field.isEditing ? parseAmount(field.draft) : field.value;

const getBalanceTone = (net: number): BalanceTone => {
  if (net > 0) return "positive";
  if (net < 0) return "negative";
  return "neutral";
};

const computePercentageChange = (started: number, net: number): number => {
  if (started === 0) return 0;
  return (net / started) * 100;
};

const updateField = (
  current: DayBlockState,
  field: BalanceField,
  patch: Partial<AmountFieldState>,
): DayBlockState => {
  if (field === "started") {
    return { ...current, started: { ...current.started, ...patch } };
  }
  return { ...current, finished: { ...current.finished, ...patch } };
};

export const useDailyBalance = () => {
  const { t, i18n } = useTranslation("");

  const [previous, setPrevious] = useState<DayBlockState>({
    started: createInitialField(MOCK_PREVIOUS_DAY.started),
    finished: createInitialField(MOCK_PREVIOUS_DAY.finished),
  });

  const [today, setToday] = useState<DayBlockState>({
    started: createInitialField(0, true),
    finished: createInitialField(0, false),
  });

  const [isTodayConfirmed, setIsTodayConfirmed] = useState(false);
  const [isSubmittingToday, setIsSubmittingToday] = useState(false);
  const [todayError, setTodayError] = useState<string | null>(null);
  const [todaySuccess, setTodaySuccess] = useState<string | null>(null);

  const beginEdit = useCallback((block: BalanceBlock, field: BalanceField): void => {
    const setState = block === "previous" ? setPrevious : setToday;
    setState((current) =>
      updateField(current, field, {
        draft: String(current[field].value),
        isEditing: true,
      }),
    );
  }, []);

  const changeDraft = useCallback(
    (block: BalanceBlock, field: BalanceField, raw: string): void => {
      const setState = block === "previous" ? setPrevious : setToday;
      setState((current) => updateField(current, field, { draft: raw }));
    },
    [],
  );

  const cancel = useCallback((block: BalanceBlock, field: BalanceField): void => {
    const setState = block === "previous" ? setPrevious : setToday;
    setState((current) =>
      updateField(current, field, { draft: "", isEditing: false }),
    );
  }, []);

  const hydrateToday = useCallback((record: DailyBalanceData): void => {
    const hasClosingBalance = record.closingBalance !== 0;

    setToday({
      started: createInitialField(record.openingBalance),
      finished: hasClosingBalance
        ? createInitialField(record.closingBalance)
        : createInitialField(0, true),
    });
    setIsTodayConfirmed(true);
    setTodayError(null);
    setTodaySuccess(null);
  }, []);

  const confirmToday = useCallback(async (): Promise<void> => {
    setTodayError(null);
    setTodaySuccess(null);

    if (!isTodayConfirmed) {
      // Scenario A: opening balance. Persist the new record in the backend
      // before enabling the closing field ("Terminé").
      const payload: CreateDailyBalancePayload = {
        date: getTodayIsoDate(),
        opening_balance: parseAmount(today.started.draft),
      };

      setIsSubmittingToday(true);
      try {
        const response =
          await CreateDailyBalanceService.createDailyBalance(payload);

        setToday((current) => ({
          started: {
            value: response.data.openingBalance,
            draft: "",
            isEditing: false,
          },
          finished: {
            value: current.finished.value,
            draft: "",
            isEditing: true,
          },
        }));
        setIsTodayConfirmed(true);
        setTodaySuccess(t("BalanceScreen.openingSuccess"));
      } catch (error: unknown) {
        let message = t("BalanceScreen.errors.generic");

        if (error instanceof CreateDailyBalanceApiError) {
          if (error.kind === "validation") {
            message = t("BalanceScreen.errors.invalidOpeningBalance");
          } else if (error.kind === "unauthorized") {
            message = t("BalanceScreen.errors.unauthorized");
          } else if (error.kind === "conflict") {
            message = t("BalanceScreen.errors.conflict");
          } else if (error.kind === "network") {
            message = t("BalanceScreen.errors.network");
          }
        }

        setTodayError(message);
      } finally {
        setIsSubmittingToday(false);
      }
      return;
    }

    // Unified save: persist every field that is currently being edited at once.
    setToday((current) => ({
      started: current.started.isEditing
        ? { value: parseAmount(current.started.draft), draft: "", isEditing: false }
        : current.started,
      finished: current.finished.isEditing
        ? { value: parseAmount(current.finished.draft), draft: "", isEditing: false }
        : current.finished,
    }));
  }, [isTodayConfirmed, today.started.draft, t]);

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    [i18n.language],
  );

  const formatAmount = useCallback(
    (value: number): string => numberFormatter.format(value),
    [numberFormatter],
  );

  const formatSignedAmount = useCallback(
    (value: number): string => {
      const absolute = numberFormatter.format(Math.abs(value));
      if (value > 0) return `+${absolute}`;
      if (value < 0) return `-${absolute}`;
      return absolute;
    },
    [numberFormatter],
  );

  const formatPercentage = useCallback(
    (value: number): string => `${formatSignedAmount(value)}%`,
    [formatSignedAmount],
  );

  const todayNet = effectiveValue(today.finished) - effectiveValue(today.started);
  const previousNet = effectiveValue(previous.finished) - effectiveValue(previous.started);
  const percentageChange = computePercentageChange(effectiveValue(today.started), todayNet);
  const todayTone = getBalanceTone(todayNet);
  const previousTone = getBalanceTone(previousNet);

  const canConfirmToday = isTodayConfirmed
    ? (today.started.isEditing ? isValidAmount(today.started.draft) : true) &&
      (today.finished.isEditing ? isValidAmount(today.finished.draft) : true)
    : isValidAmount(today.started.draft);

  return {
    previous,
    today,
    isTodayConfirmed,
    isSubmittingToday,
    todayError,
    todaySuccess,
    todayNet,
    previousNet,
    percentageChange,
    todayTone,
    previousTone,
    canConfirmToday,
    beginEdit,
    changeDraft,
    cancel,
    confirmToday,
    hydrateToday,
    formatAmount,
    formatSignedAmount,
    formatPercentage,
  };
};

export default useDailyBalance;
