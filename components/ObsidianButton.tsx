import Link from "next/link";
import type { ReactNode } from "react";

type ObsidianButtonProps = {
  children: ReactNode;
  href?: string;
  /** "ghost": SpaceX-style ghost outline (transparent, 1px white border).
   *  "glass": frosted glass capsule for HUD actions (chrome only). */
  variant?: "ghost" | "glass";
  size?: "md" | "sm";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

/**
 * Obsidian buttons. Ghost is the primary voice: transparent with a 1px
 * white border. Glass is the HUD-action variant — glass chrome, specular
 * glint, soft black shadow. No blue, no gradients, no filled primaries.
 */
export default function ObsidianButton({
  children,
  href,
  variant = "ghost",
  size = "md",
  disabled = false,
  className = "",
  onClick,
}: ObsidianButtonProps) {
  const cls = [
    "og-btn",
    variant === "ghost" ? "og-btn-ghost" : "og-btn-glass",
    size === "sm" ? "og-btn-sm" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href && !disabled) {
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
