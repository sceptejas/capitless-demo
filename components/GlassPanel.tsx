import { ReactNode } from "react";

// In the brutalist theme GlassPanel is just a surface panel — no blur.
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
      className={className}
      style={{
        background: "#111",
        border: accentBorder ? "1px solid #FFF" : "1px solid #222",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
