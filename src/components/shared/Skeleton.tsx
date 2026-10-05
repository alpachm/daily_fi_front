// src/components/shared/Skeleton.tsx
import "./styles/Skeleton.css";

export interface SkeletonProps {
    className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
    const composedClassName = className ? `skeleton ${className}` : "skeleton";

    return <div className={composedClassName} aria-hidden="true" />;
};

export default Skeleton;
