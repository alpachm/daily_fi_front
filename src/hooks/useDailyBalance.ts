// src/hooks/useDailyBalance.ts
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useCreateDailyBalance } from "./useCreateDailyBalance";
import { useCloseDailyBalance } from "./useCloseDailyBalance";
import { useUpdateDailyBalance } from "./useUpdateDailyBalance";
import { useGetBalancePerDay } from "./useGetBalancePerDay";
import {
    CreateDailyBalanceApiError,
    type CreateDailyBalancePayload,
} from "../interfaces/CreateDailyBalanceService.interface";
import { CloseDailyBalanceApiError } from "../interfaces/CloseDailyBalanceService.interface";
import {
    UpdateDailyBalanceApiError,
    type UpdateDailyBalancePayload,
} from "../interfaces/UpdateDailyBalanceService.interface";
import { getTodayIsoDate } from "../utils/date";

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

export const useDailyBalance = () => {
  const { t, i18n } = useTranslation("");

  const { data: balanceData } = useGetBalancePerDay();

  // Transient form state: only drafts and edit flags live locally. Persisted
  // values are derived below straight from the query cache (single source of
  // truth), so every cache write performed by the mutations flows back into
  // the UI without a manual refresh.
  const [startedDraft, setStartedDraft] = useState("");
  const [finishedDraft, setFinishedDraft] = useState("");
  const [startedEditing, setStartedEditing] = useState(false);
  const [finishedEditing, setFinishedEditing] = useState(false);
  const [todayError, setTodayError] = useState<string | null>(null);
  const [todaySuccess, setTodaySuccess] = useState<string | null>(null);

  const {
    mutateAsync: createDailyBalanceAsync,
    isPending: isCreatingToday,
  } = useCreateDailyBalance();

  const {
    mutateAsync: closeDailyBalanceAsync,
    isPending: isClosingToday,
  } = useCloseDailyBalance();

  // After a successful PATCH both inputs must exit edit mode and drop any
  // stale draft text. The displayed values re-sync automatically because the
  // mutation writes the authoritative server response into the cache and the
  // inputs read their `value` straight from it.
  const handleUpdateSuccess = useCallback((): void => {
    setStartedDraft("");
    setFinishedDraft("");
    setStartedEditing(false);
    setFinishedEditing(false);
  }, []);

  const {
    mutateAsync: updateDailyBalanceAsync,
    isPending: isUpdatingToday,
  } = useUpdateDailyBalance({ onSuccess: handleUpdateSuccess });

  const isTodayConfirmed = balanceData != null;

  const today: DayBlockState = {
    started: {
      value: balanceData?.openingBalance ?? 0,
      draft: startedDraft,
      isEditing: balanceData == null || startedEditing,
    },
    finished: {
      value: balanceData?.closingBalance ?? 0,
      draft: finishedDraft,
      isEditing:
        balanceData != null &&
        (balanceData.closingBalance === 0 || finishedEditing),
    },
  };

  const beginEdit = useCallback(
    (field: BalanceField): void => {
      if (field === "started") {
        setStartedDraft(String(balanceData?.openingBalance ?? 0));
        setStartedEditing(true);
        return;
      }
      setFinishedDraft(String(balanceData?.closingBalance ?? 0));
      setFinishedEditing(true);
    },
    [balanceData],
  );

  const changeDraft = useCallback(
    (field: BalanceField, raw: string): void => {
      if (field === "started") {
        setStartedDraft(raw);
        return;
      }
      setFinishedDraft(raw);
    },
    [],
  );

  const cancel = useCallback((field: BalanceField): void => {
    if (field === "started") {
      setStartedDraft("");
      setStartedEditing(false);
      return;
    }
    setFinishedDraft("");
    setFinishedEditing(false);
  }, []);

  const confirmToday = useCallback(async (): Promise<void> => {
    setTodayError(null);
    setTodaySuccess(null);

    // Scenario 1: no record exists yet -> create the opening balance.
    if (balanceData == null) {
      const payload: CreateDailyBalancePayload = {
        date: getTodayIsoDate(),
        opening_balance: parseAmount(startedDraft),
      };

      try {
        await createDailyBalanceAsync(payload);
        setStartedDraft("");
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

    // A record already exists: dispatch based on which field is being edited.
    const recordId = balanceData.id;

    // Scenario 2: editing the opening balance -> update it.
    if (startedEditing) {
      // When both "Empecé" and "Terminé" are being edited at the same time,
      // build the payload from both draft values. Reading `closing_balance`
      // from the query cache here would send the previously persisted value
      // and silently discard whatever the user typed into "Terminé".
      const payload: UpdateDailyBalancePayload = finishedEditing
        ? {
            opening_balance: parseAmount(startedDraft),
            closing_balance: parseAmount(finishedDraft),
          }
        : {
            opening_balance: parseAmount(startedDraft),
            closing_balance: balanceData.closingBalance,
          };

      try {
        await updateDailyBalanceAsync({ id: recordId, payload });
        setTodaySuccess(
          finishedEditing
            ? t("BalanceScreen.balanceUpdateSuccess")
            : t("BalanceScreen.openingUpdateSuccess"),
        );
      } catch (error: unknown) {
        let message = t("BalanceScreen.errors.generic");

        if (error instanceof UpdateDailyBalanceApiError) {
          if (error.kind === "validation") {
            message = t("BalanceScreen.errors.invalidOpeningBalance");
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

    // The closing field is being submitted.
    // Scenario 3: first time closing -> close the day.
    if (balanceData.closingBalance === 0) {
      try {
        await closeDailyBalanceAsync({
          id: recordId,
          closingBalance: parseAmount(finishedDraft),
        });
        setFinishedDraft("");
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

    // Scenario 4: editing an already closed balance -> update it.
    const payload: UpdateDailyBalancePayload = {
      opening_balance: balanceData.openingBalance,
      closing_balance: parseAmount(finishedDraft),
    };

    try {
      await updateDailyBalanceAsync({ id: recordId, payload });
      setTodaySuccess(t("BalanceScreen.closingUpdateSuccess"));
    } catch (error: unknown) {
      let message = t("BalanceScreen.errors.generic");

      if (error instanceof UpdateDailyBalanceApiError) {
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
  }, [
    balanceData,
    startedEditing,
    finishedEditing,
    startedDraft,
    finishedDraft,
    t,
    createDailyBalanceAsync,
    closeDailyBalanceAsync,
    updateDailyBalanceAsync,
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

  const canConfirmToday = balanceData == null
    ? isValidAmount(today.started.draft)
    : startedEditing && finishedEditing
      ? isValidAmount(today.started.draft) && isValidAmount(today.finished.draft)
      : today.started.isEditing
        ? isValidAmount(today.started.draft)
        : today.finished.isEditing
          ? isValidAmount(today.finished.draft)
          : false;

  return {
    today,
    isTodayConfirmed,
    isSubmittingToday: isCreatingToday || isClosingToday || isUpdatingToday,
    todayError,
    todaySuccess,
    canConfirmToday,
    beginEdit,
    changeDraft,
    cancel,
    confirmToday,
    formatAmount,
    formatSignedAmount,
    formatPercentage,
  };
};

export default useDailyBalance;
