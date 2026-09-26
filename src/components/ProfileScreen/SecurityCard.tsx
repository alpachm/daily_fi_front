// src/components/ProfileScreen/SecurityCard.tsx
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { LogOut, MonitorSmartphone, ShieldCheck } from "lucide-react";
import { PasswordField } from "./PasswordField";
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

export const SecurityCard = () => {
    const { t } = useTranslation("");
    const [formData, setFormData] = useState<PasswordFormData>(INITIAL_FORM_DATA);
    const [visibleFields, setVisibleFields] =
        useState<Record<PasswordFieldKey, boolean>>(INITIAL_VISIBILITY);

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

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        // Mock: clear the form. Replace with the real auth/API call when wired.
        setFormData(INITIAL_FORM_DATA);
    };

    return (
        <section className="security-card" aria-labelledby="security-card-title">
            <header className="security-card__header">
                <h2 id="security-card-title" className="security-card__title">
                    {t("ProfileScreen.securityTitle")}
                </h2>
            </header>

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
                    >
                        {t("ProfileScreen.securityUpdatePasswordButton")}
                    </button>
                </div>
            </form>

            <div className="security-card__section security-card__section--divided">
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

            <div className="security-card__section security-card__section--divided">
                <div className="security-card__action-row">
                    <button
                        type="button"
                        className="security-card__button security-card__button--danger"
                    >
                        <LogOut size={18} aria-hidden="true" />
                        {t("ProfileScreen.securityLogoutButton")}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default SecurityCard;
