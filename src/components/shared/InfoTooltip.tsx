// src/components/shared/InfoTooltip.tsx
import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import "./styles/InfoTooltip.css";

interface InfoTooltipProps {
    label: string;
    content: string;
    children: ReactNode;
}

interface TooltipPosition {
    top: number;
    left: number;
}

const TOOLTIP_GAP_PX = 8;

export const InfoTooltip = ({
    label,
    content,
    children,
}: InfoTooltipProps) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [position, setPosition] = useState<TooltipPosition>({
        top: 0,
        left: 0,
    });
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const tooltipId = useId();

    const showTooltip = (): void => {
        const trigger = triggerRef.current;
        if (trigger) {
            const { top, left, width } = trigger.getBoundingClientRect();
            setPosition({
                top: top - TOOLTIP_GAP_PX,
                left: left + width / 2,
            });
        }
        setIsVisible(true);
    };

    const hideTooltip = (): void => setIsVisible(false);

    useEffect(() => {
        if (!isVisible) return;

        const closeOnScroll = (): void => setIsVisible(false);
        const closeOnResize = (): void => setIsVisible(false);

        window.addEventListener("scroll", closeOnScroll, true);
        window.addEventListener("resize", closeOnResize);

        return () => {
            window.removeEventListener("scroll", closeOnScroll, true);
            window.removeEventListener("resize", closeOnResize);
        };
    }, [isVisible]);

    return (
        <>
            <button
                type="button"
                ref={triggerRef}
                className="info-tooltip__trigger"
                aria-label={label}
                aria-describedby={isVisible ? tooltipId : undefined}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onFocus={showTooltip}
                onBlur={hideTooltip}
            >
                {children}
            </button>

            {isVisible
                ? createPortal(
                      <span
                          id={tooltipId}
                          className="info-tooltip__bubble"
                          role="tooltip"
                          style={{
                              top: position.top,
                              left: position.left,
                          }}
                      >
                          {content}
                      </span>,
                      document.body,
                  )
                : null}
        </>
    );
};

export default InfoTooltip;
