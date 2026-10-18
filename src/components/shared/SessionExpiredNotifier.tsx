// src/components/shared/SessionExpiredNotifier.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { AutomaticAlertModal } from "./AutomaticAlertModal";
import { SESSION_EXPIRED_EVENT } from "../../utils/sessionExpiry";

/**
 * Global listener that surfaces the "session expired" notification whenever the
 * centralized HTTP client detects an expired token on a protected request.
 *
 * It renders no markup of its own — it reuses the shared `AutomaticAlertModal`.
 */
export const SessionExpiredNotifier = () => {
    const { t } = useTranslation("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleSessionExpired = (): void => {
            setIsOpen(true);
        };

        window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);

        return () => {
            window.removeEventListener(
                SESSION_EXPIRED_EVENT,
                handleSessionExpired,
            );
        };
    }, []);

    return (
        <AutomaticAlertModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            message={t("Common.sessionExpired")}
            variant="warning"
        />
    );
};

export default SessionExpiredNotifier;
