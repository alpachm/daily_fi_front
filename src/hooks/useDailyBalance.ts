// src/hooks/useDailyBalance.ts
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useCreateDailyBalance } from "./useCreateDailyBalance";
import { useCloseDailyBalance } from "./useCloseDailyBalance";
import {
    CreateDailyBalanceApiError,
    type CreateDailyBalancePayload,
} from "../interfaces/CreateDailyBalanceService.interface";
import { CloseDailyBalanceApiError } from "../interfaces/CloseDailyBalanceService.interface";
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

const getBalanceTone = (net: number): BalanceTone => {
  if (net > 0) return "positive";
  if (net < 0) return "negative";
  return "neutral";
};

export interface NetBalancePresentation {
  readonly hasData: boolean;
  readonly net: number;
  readonly tone: BalanceTone;
}

export const resolveNetBalance = (
  openingBalance: number,
  closingBalance: number,
): NetBalancePresentation => {
  if (closingBalance === 0) {
    return { hasData: false, net: 0, tone: "neutral" };
  }

  const net = closingBalance - openingBalance;
  return { hasData: true, net, tone: getBalanceTone(net) };
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

  const {
    mutateAsync: createDailyBalanceAsync,
    isPending: isCreatingToday,
  } = useCreateDailyBalance();

  const {
    mutateAsync: closeDailyBalanceAsync,
    isPending: isClosingToday,
  } = useCloseDailyBalance();

  const [today, setToday] = useState<DayBlockState>({
    started: createInitialField(0, true),
    finished: createInitialField(0, false),
  });

  const [todayId, setTodayId] = useState<number | null>(null);
  const [isTodayConfirmed, setIsTodayConfirmed] = useState(false);
  const [todayError, setTodayError] = useState<string | null>(null);
  const [todaySuccess, setTodaySuccess] = useState<string | null>(null);

  const beginEdit = useCallback((field: BalanceField): void => {
    setToday((current) =>
      updateField(current, field, {
        draft: String(current[field].value),
        isEditing: true,
      }),
    );
  }, []);

  const changeDraft = useCallback(
    (field: BalanceField, raw: string): void => {
      setToday((current) => updateField(current, field, { draft: raw }));
    },
    [],
  );

  const cancel = useCallback((field: BalanceField): void => {
    setToday((current) =>
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
    setTodayId(record.id);
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

      try {
        const response = await createDailyBalanceAsync(payload);

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
        setTodayId(response.data.id);
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
      }
      return;
    }

    // Scenario B: closing balance. Persist the closing amount through the
    // dedicated close endpoint so the active day is closed server-side.
    if (today.finished.isEditing) {
      if (todayId === null) {
        setTodayError(t("BalanceScreen.errors.generic"));
        return;
      }

      try {
        const response = await closeDailyBalanceAsync({
          id: todayId,
          closingBalance: parseAmount(today.finished.draft),
        });

        setToday((current) => ({
          started: current.started.isEditing
            ? { value: parseAmount(current.started.draft), draft: "", isEditing: false }
            : current.started,
          finished: {
            value: response.data.closingBalance,
            draft: "",
            isEditing: false,
          },
        }));
        setTodaySuccess(t("BalanceScreen.closingSuccess"));
      } catch (error: unknown) {
        let message = t("BalanceScreen.errors.generic");

        if (error instanceof CloseDailyBalanceApiError) {
          if (error.kind === "validation") {
            message = t("BalanceScreen.errors.invalidClosingBalance");
          } else if (error.kind === "unauthorized") {
            message = t("BalanceScreen.errors.unauthorized");
          } else if (error.kind === "forbidden") {
            message = t("BalanceScreen.errors.forbidden");
          } else if (error.kind === "notFound") {
            message = t("BalanceScreen.errors.notFound");
          } else if (error.kind === "network") {
            message = t("BalanceScreen.errors.network");
          }
        }

        setTodayError(message);
      }
      return;
    }

    // Only the opening field is being edited after confirmation. There is no
    // dedicated endpoint to update it yet, so commit it locally.
    setToday((current) => ({
      started: current.started.isEditing
        ? { value: parseAmount(current.started.draft), draft: "", isEditing: false }
        : current.started,
      finished: current.finished,
    }));
  }, [
    isTodayConfirmed,
    todayId,
    today.started.draft,
    today.finished.isEditing,
    today.finished.draft,
    t,
    createDailyBalanceAsync,
    closeDailyBalanceAsync,
  ]);

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

  const canConfirmToday = isTodayConfirmed
    ? (today.started.isEditing ? isValidAmount(today.started.draft) : true) &&
      (today.finished.isEditing ? isValidAmount(today.finished.draft) : true)
    : isValidAmount(today.started.draft);

  return {
    today,
    isTodayConfirmed,
    isSubmittingToday: isCreatingToday || isClosingToday,
    todayError,
    todaySuccess,
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
