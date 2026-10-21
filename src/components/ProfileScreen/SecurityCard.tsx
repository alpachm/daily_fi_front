// src/components/ProfileScreen/SecurityCard.tsx
import { useCallback, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import {
    Check,
    LoaderCircle,
    LogOut,
    MonitorSmartphone,
    ShieldCheck,
    TriangleAlert,
} from "lucide-react";
import { PasswordField } from "./PasswordField";
import { useChangePassword } from "../../hooks/useChangePassword";
import { useLogout } from "../../hooks/useLogout";
import { ChangePasswordApiError } from "../../interfaces/ChangePasswordService.interface";
import {
    getChangePasswordErrorKey,
    getChangePasswordFieldErrorMessage,
} from "../../utils/changePasswordError";
import { AlertModal } from "../shared/AlertModal";
import { AutomaticAlertModal } from "../shared/AutomaticAlertModal";
import "./styles/SecurityCard.css";

interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

type PasswordFieldKey = keyof PasswordFormData;

interface PasswordFieldDescriptor {
    key: PasswordFieldKey;
    label: string;
    autoComplete: "current-password" | "new-password";
}

const INITIAL_FORM_DATA: PasswordFormData = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
};

const INITIAL_VISIBILITY: Record<PasswordFieldKey, boolean> = {
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
};

type SecurityAlertVariant = "success" | "error";

interface SecurityAlert {
    variant: SecurityAlertVariant;
    message: string;
}

export const SecurityCard = () => {
    const { t } = useTranslation("");
    const { isLoading: isLoggingOut, errorMessage: logoutError, logout } =
        useLogout();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [formData, setFormData] = useState<PasswordFormData>(INITIAL_FORM_DATA);
    const [visibleFields, setVisibleFields] =
        useState<Record<PasswordFieldKey, boolean>>(INITIAL_VISIBILITY);
    const [alert, setAlert] = useState<SecurityAlert | null>(null);

    const {
        mutateAsync: changePassword,
        isPending: isUpdatingPassword,
    } = useChangePassword();

    const passwordFields: PasswordFieldDescriptor[] = [
        {
            key: "currentPassword",
            label: t("ProfileScreen.securityCurrentPasswordLabel"),
            autoComplete: "current-password",
        },
        {
            key: "newPassword",
            label: t("ProfileScreen.securityNewPasswordLabel"),
            autoComplete: "new-password",
        },
        {
            key: "confirmPassword",
            label: t("ProfileScreen.securityConfirmPasswordLabel"),
            autoComplete: "new-password",
        },
    ];

    const handleChange =
        (field: PasswordFieldKey) =>
        (event: ChangeEvent<HTMLInputElement>): void => {
            setFormData((previous) => ({ ...previous, [field]: event.target.value }));
        };

    const toggleVisibility = (field: PasswordFieldKey): void => {
        setVisibleFields((previous) => ({ ...previous, [field]: !previous[field] }));
    };

    const handleAlertClose = useCallback((): void => {
        setAlert(null);
    }, []);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setAlert({
                variant: "error",
                message: t(
                    "ProfileScreen.securityUpdatePasswordErrorMismatch",
                ),
            });
            return;
        }

        setAlert(null);

        try {
            await changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            setFormData(INITIAL_FORM_DATA);
            setVisibleFields(INITIAL_VISIBILITY);

            setAlert({
                variant: "success",
                message: t("ProfileScreen.securityUpdatePasswordSuccess"),
            });
        } catch (error: unknown) {
            // The session-expired flow already clears credentials and redirects
            // through the global notifier, so do not render a duplicate alert.
            if (
                error instanceof ChangePasswordApiError &&
                error.kind === "unauthorized"
            ) {
                return;
            }

            setAlert({
                variant: "error",
                message:
                    getChangePasswordFieldErrorMessage(error) ??
                    t(getChangePasswordErrorKey(error)),
            });
        }
    };

    const handleConfirmLogout = async (): Promise<void> => {
        await logout();
        setIsLogoutModalOpen(false);
    };

    return (
        <section className="security-card" aria-labelledby="security-card-title">
            <header className="security-card__header">
                <h2 id="security-card-title" className="security-card__title">
                    {t("ProfileScreen.securityTitle")}
                </h2>
            </header>

            <div className="security-card__grid">
                <form className="security-card__section" onSubmit={handleSubmit} noValidate>
                    {passwordFields.map(({ key, label, autoComplete }) => (
                        <PasswordField
                            key={key}
                            id={`security-${key}`}
                            label={label}
                            value={formData[key]}
                            isVisible={visibleFields[key]}
                            autoComplete={autoComplete}
                            onChange={handleChange(key)}
                            onToggleVisibility={() => toggleVisibility(key)}
                            showLabel={t("ProfileScreen.securityShowPassword")}
                            hideLabel={t("ProfileScreen.securityHidePassword")}
                        />
                    ))}

                    <div className="security-card__action-row">
                        <button
                            type="submit"
                            className="security-card__button security-card__button--primary"
                            disabled={isUpdatingPassword}
                            aria-busy={isUpdatingPassword}
                        >
                            {isUpdatingPassword && (
                                <LoaderCircle
                                    size={18}
                                    className="security-card__spinner"
                                    aria-hidden="true"
                                />
                            )}
                            {t("ProfileScreen.securityUpdatePasswordButton")}
                        </button>
                    </div>
                </form>

                <div className="security-card__section">
                    <h3 className="security-card__section-title">
                        {t("ProfileScreen.securitySessionsTitle")}
                    </h3>

                    <ul className="security-card__sessions">
                        <li className="security-card__session">
                            <span className="security-card__session-icon">
                                <MonitorSmartphone size={18} aria-hidden="true" />
                            </span>
                            <div className="security-card__session-info">
                                <span className="security-card__session-device">
                                    {t("ProfileScreen.securityCurrentDeviceLabel")}
                                </span>
                                <span className="security-card__session-meta">
                                    <ShieldCheck size={14} aria-hidden="true" />
                                    {t("ProfileScreen.securityActiveSessionLabel")}
                                </span>
                            </div>
                            <span className="security-card__session-last">
                                <span className="security-card__session-last-label">
                                    {t("ProfileScreen.securityLastActivityLabel")}
                                </span>
                                {t("ProfileScreen.securityLastActivityValue")}
                            </span>
                        </li>
                    </ul>

                    <div className="security-card__action-row">
                        <button
                            type="button"
                            className="security-card__button security-card__button--secondary"
                        >
                            {t("ProfileScreen.securityCloseSessionsButton")}
                        </button>
                    </div>
                </div>
            </div>

            <div className="security-card__section security-card__section--divided">
                {logoutError !== null && (
                    <div className="security-card__alert" role="alert">
                        <TriangleAlert
                            size={18}
                            className="security-card__alert-icon"
                            aria-hidden="true"
                        />
                        <span>{logoutError}</span>
                    </div>
                )}

                <div className="security-card__action-row">
                    <button
                        type="button"
                        className="security-card__button security-card__button--danger"
                        onClick={() => setIsLogoutModalOpen(true)}
                    >
                        <LogOut size={18} aria-hidden="true" />
                        {t("ProfileScreen.securityLogoutButton")}
                    </button>
                </div>
            </div>
            <AlertModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleConfirmLogout}
                title={t("ProfileScreen.securityLogoutModalTitle")}
                message={t("ProfileScreen.securityLogoutModalMessage")}
                icon={<LogOut size={24} aria-hidden="true" />}
                confirmText={t("ProfileScreen.securityLogoutButton")}
                variant="warning"
                isLoading={isLoggingOut}
            />
            {alert !== null ? (
                <AutomaticAlertModal
                    isOpen
                    onClose={handleAlertClose}
                    message={alert.message}
                    icon={
                        alert.variant === "success" ? (
                            <Check size={24} aria-hidden="true" />
                        ) : (
                            <TriangleAlert size={24} aria-hidden="true" />
                        )
                    }
                    variant={alert.variant}
                />
            ) : null}
        </section>
    );
};

export default SecurityCard;
