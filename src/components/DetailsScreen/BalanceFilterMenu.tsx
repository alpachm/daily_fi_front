// src/components/DetailsScreen/BalanceFilterMenu.tsx
import type { RefObject } from "react";
import { Check, ChevronDown, Filter } from "lucide-react";
import type { FilterOption } from "../../hooks/useBalanceFilter";
import type { FilterPeriod } from "./Balance";
import "./styles/BalanceFilterMenu.css";

interface BalanceFilterMenuProps {
    options: FilterOption[];
    selected: FilterPeriod;
    isOpen: boolean;
    containerRef: RefObject<HTMLDivElement | null>;
    menuId: string;
    triggerLabel: string;
    note: string;
    onToggle: () => void;
    onSelect: (period: FilterPeriod) => void;
}

export const BalanceFilterMenu = ({
    options,
    selected,
    isOpen,
    containerRef,
    menuId,
    triggerLabel,
    note,
    onToggle,
    onSelect,
}: BalanceFilterMenuProps) => {
    return (
        <div className="balance-filter-menu" ref={containerRef}>
            <button
                type="button"
                className="balance-filter-menu__trigger"
                onClick={onToggle}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                aria-controls={menuId}
                aria-label={triggerLabel}
            >
                <Filter size={18} aria-hidden="true" />
                <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className={`balance-filter-menu__chevron${
                        isOpen ? " balance-filter-menu__chevron--open" : ""
                    }`}
                />
            </button>

            <div
                id={menuId}
                className={`balance-filter-menu__dropdown${
                    isOpen ? " balance-filter-menu__dropdown--open" : ""
                }`}
                aria-hidden={!isOpen}
                inert={!isOpen}
            >
                <ul className="balance-filter-menu__list" role="menu" aria-label={triggerLabel}>
                    {options.map((option) => {
                        const isSelected = option.value === selected;
                        return (
                            <li key={option.value} role="none">
                                <button
                                    type="button"
                                    role="menuitemradio"
                                    aria-checked={isSelected}
                                    className={`balance-filter-menu__item${
                                        isSelected ? " balance-filter-menu__item--selected" : ""
                                    }`}
                                    onClick={() => onSelect(option.value)}
                                >
                                    <span>{option.label}</span>
                                    {isSelected ? (
                                        <Check
                                            size={16}
                                            aria-hidden="true"
                                            className="balance-filter-menu__item-check"
                                        />
                                    ) : null}
                                </button>
                            </li>
                        );
                    })}
                </ul>
                <p className="balance-filter-menu__note">{note}</p>
            </div>
        </div>
    );
};

export default BalanceFilterMenu;
