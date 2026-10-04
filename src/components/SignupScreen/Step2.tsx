// src/components/SignupScreen/Step2.tsx
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Check, CircleAlert } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import "./styles/Step2.css";

interface Step2Props {
    isSuccess: boolean;
    errorMessage: string | null;
    onGoToStep1: () => void;
}

export const Step2 = ({ isSuccess, errorMessage, onGoToStep1 }: Step2Props) => {
    const { t } = useTranslation("");

    const title = isSuccess
        ? t("SignupScreen.success.title")
        : t("SignupScreen.error.title");

    const description = isSuccess
        ? t("SignupScreen.success.description")
        : errorMessage ?? t("SignupScreen.error.description");

    const logoClassName = isSuccess
        ? "step2-logo step2-logo--success"
        : "step2-logo step2-logo--error";

    return (
        <div className="step2">
            <motion.div
                className={logoClassName}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                aria-hidden="true"
            >
                {isSuccess ? <Check size={40} /> : <CircleAlert size={40} />}
            </motion.div>

            <h2 className="step2-title">{title}</h2>
            <p className="step2-message">{description}</p>

            {isSuccess ? (
                <Link to={ROUTES.LOGIN} className="step2-action">
                    {t("SignupScreen.success.action")}
                </Link>
            ) : (
                <button
                    type="button"
                    className="step2-action"
                    onClick={onGoToStep1}
                >
                    {t("SignupScreen.error.action")}
                </button>
            )}
        </div>
    );
};

export default Step2;
