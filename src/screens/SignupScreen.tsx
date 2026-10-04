// src/screens/SignupScreen.tsx
import { useCallback, useState } from "react";
import type { FormEvent } from "react";
import {
    AnimatePresence,
    motion,
    type Transition,
    type Variants,
} from "framer-motion";
import "../styles/SignupScreen.css";
import { useRegister } from "../hooks/useRegister";
import { Step1 } from "../components/SignupScreen/Step1";
import { Step2 } from "../components/SignupScreen/Step2";

type StepDirection = 1 | -1;

const stepVariants: Variants = {
    enter: (direction: StepDirection) => ({ opacity: 0, x: direction * 48 }),
    center: { opacity: 1, x: 0 },
    exit: (direction: StepDirection) => ({ opacity: 0, x: direction * -48 }),
};

const stepTransition: Transition = { duration: 0.28, ease: "easeInOut" };

export const SignupScreen = () => {
    const register = useRegister();
    const { handleSubmit: submitRegistration, goToStep1 } = register;
    const [direction, setDirection] = useState<StepDirection>(1);

    const handleSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>): void => {
            setDirection(1);
            submitRegistration(event);
        },
        [submitRegistration],
    );

    const handleGoToStep1 = useCallback((): void => {
        setDirection(-1);
        goToStep1();
    }, [goToStep1]);

    return (
        <main className="signup-screen">
            <div className="signup-card">
                <AnimatePresence mode="wait" initial={false}>
                    {register.currentStep === 1 ? (
                        <motion.div
                            key="step-1"
                            className="signup-step"
                            custom={direction}
                            variants={stepVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={stepTransition}
                        >
                            <Step1
                                email={register.email}
                                password={register.password}
                                confirmPassword={register.confirmPassword}
                                isLoading={register.isLoading}
                                fieldErrors={register.fieldErrors}
                                onEmailChange={register.setEmail}
                                onPasswordChange={register.setPassword}
                                onConfirmPasswordChange={register.setConfirmPassword}
                                onSubmit={handleSubmit}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step-2"
                            className="signup-step"
                            custom={direction}
                            variants={stepVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={stepTransition}
                        >
                            <Step2
                                isSuccess={register.isSuccess}
                                errorMessage={register.errorMessage}
                                onGoToStep1={handleGoToStep1}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
};

export default SignupScreen;
