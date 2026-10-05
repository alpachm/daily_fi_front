// src/hooks/useBalanceDiario.ts
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

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

export const useBalanceDiario = () => {
  const { i18n } = useTranslation("");

  const [previous, setPrevious] = useState<DayBlockState>({
    started: createInitialField(MOCK_PREVIOUS_DAY.started),
    finished: createInitialField(MOCK_PREVIOUS_DAY.finished),
  });

  const [today, setToday] = useState<DayBlockState>({
    started: createInitialField(0, true),
    finished: createInitialField(0, false),
  });

  const [isTodayConfirmed, setIsTodayConfirmed] = useState(false);

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

  const commit = useCallback((block: BalanceBlock, field: BalanceField): void => {
    const setState = block === "previous" ? setPrevious : setToday;
    setState((current) =>
      updateField(current, field, {
        value: parseAmount(current[field].draft),
        draft: "",
        isEditing: false,
      }),
    );
  }, []);

  const cancel = useCallback((block: BalanceBlock, field: BalanceField): void => {
    const setState = block === "previous" ? setPrevious : setToday;
    setState((current) =>
      updateField(current, field, { draft: "", isEditing: false }),
    );
  }, []);

  const confirmToday = useCallback((): void => {
    if (isTodayConfirmed) {
      // Close the current shift: commit the closing balance.
      setToday((current) => ({
        ...current,
        finished: {
          value: parseAmount(current.finished.draft),
          draft: "",
          isEditing: false,
        },
      }));
      return;
    }

    // Open the shift: commit the opening balance and enable the closing field.
    setToday((current) => ({
      started: {
        value: parseAmount(current.started.draft),
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
  }, [isTodayConfirmed]);

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
    ? isValidAmount(today.finished.draft)
    : isValidAmount(today.started.draft);

  return {
    previous,
    today,
    isTodayConfirmed,
    todayNet,
    previousNet,
    percentageChange,
    todayTone,
    previousTone,
    canConfirmToday,
    beginEdit,
    changeDraft,
    commit,
    cancel,
    confirmToday,
    formatAmount,
    formatSignedAmount,
    formatPercentage,
  };
};

export default useBalanceDiario;
