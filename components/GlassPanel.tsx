import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
  className?: string;
  accentBorder?: boolean;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

export default function GlassPanel({ children, className = "", accentBorder = false, style, ...rest }: Props) {
  return (
    <div
      className={`glass rounded-[var(--radius)] ${accentBorder ? "border-[var(--border-accent)]" : ""} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}
