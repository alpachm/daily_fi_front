// src/components/ProfileScreen/PreferencesCard.tsx
import { useTranslation } from "react-i18next";
import { Globe, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import type { ThemeMode } from "../../hooks/useTheme";
import type { SupportedLanguage } from "../../i18n/resources";
import "./styles/PreferencesCard.css";

type LanguageCode = SupportedLanguage;
type IconComponent = typeof Sun;

interface ThemeOption {
    value: ThemeMode;
    label: string;
    icon: IconComponent;
}

interface LanguageOption {
    value: LanguageCode;
    label: string;
}

const resolveLanguageCode = (language: string): LanguageCode => {
    const baseCode = language.split("-")[0];
    return baseCode === "es" ? "es" : "en";
};

export const PreferencesCard = () => {
    const { t, i18n } = useTranslation("");
    const { theme, setTheme } = useTheme();

    const currentLanguage: LanguageCode = resolveLanguageCode(
        i18n.resolvedLanguage ?? i18n.language,
    );

    const themeOptions: ThemeOption[] = [
        {
            value: "light",
            label: t("ProfileScreen.preferencesThemeLight"),
            icon: Sun,
        },
        {
            value: "dark",
            label: t("ProfileScreen.preferencesThemeDark"),
            icon: Moon,
        },
        {
            value: "system",
            label: t("ProfileScreen.preferencesThemeSystem"),
            icon: Monitor,
        },
    ];

    const languageOptions: LanguageOption[] = [
        {
            value: "es",
            label: t("ProfileScreen.preferencesLanguageSpanish"),
        },
        {
            value: "en",
            label: t("ProfileScreen.preferencesLanguageEnglish"),
        },
    ];

    const handleThemeChange = (mode: ThemeMode): void => {
        setTheme(mode);
    };

    const handleLanguageChange = (language: LanguageCode): void => {
        void i18n.changeLanguage(language);
    };

    return (
        <section className="preferences-card" aria-labelledby="preferences-card-title">
            <header className="preferences-card__header">
                <h2 id="preferences-card-title" className="preferences-card__title">
                    {t("ProfileScreen.preferencesTitle")}
                </h2>
            </header>

            <div className="preferences-card__content">
                <div className="preferences-card__section">
                    <h3 className="preferences-card__section-title">
                        {t("ProfileScreen.preferencesAppearanceLabel")}
                    </h3>
                    <div
                        className="preferences-card__segmented"
                        role="radiogroup"
                        aria-label={t("ProfileScreen.preferencesAppearanceLabel")}
                    >
                        {themeOptions.map(({ value, label, icon: Icon }) => {
                            const isActive = theme === value;
                            return (
                                <button
                                    key={value}
                                    type="button"
                                    role="radio"
                                    aria-checked={isActive}
                                    className={`preferences-card__segment${
                                        isActive ? " preferences-card__segment--active" : ""
                                    }`}
                                    onClick={() => handleThemeChange(value)}
                                >
                                    <Icon size={18} aria-hidden="true" />
                                    <span>{label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="preferences-card__section">
                    <h3 className="preferences-card__section-title">
                        {t("ProfileScreen.preferencesLanguageLabel")}
                    </h3>
                    <div
                        className="preferences-card__segmented"
                        role="radiogroup"
                        aria-label={t("ProfileScreen.preferencesLanguageLabel")}
                    >
                        {languageOptions.map(({ value, label }) => {
                            const isActive = currentLanguage === value;
                            return (
                                <button
                                    key={value}
                                    type="button"
                                    role="radio"
                                    aria-checked={isActive}
                                    className={`preferences-card__segment${
                                        isActive ? " preferences-card__segment--active" : ""
                                    }`}
                                    onClick={() => handleLanguageChange(value)}
                                >
                                    <Globe size={18} aria-hidden="true" />
                                    <span>{label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PreferencesCard;
