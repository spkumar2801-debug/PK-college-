import type { SVGProps } from "react";
import { useCollegeStore } from "@/lib/college-store";

interface CollegeCrestProps extends SVGProps<SVGSVGElement> {
  variant?: "default" | "light" | "dark";
  customLogoUrl?: string;
  imgClassName?: string;
}

/**
 * Official clean institutional logo/monogram for PK College of Engineering & Technology.
 * If an admin has uploaded a custom logo via Admin → Branding, it renders the custom logo.
 * Otherwise, renders an authoritative institutional shield with a serif "PK" monogram.
 */
export function CollegeCrest({
  className = "w-12 h-12",
  variant = "default",
  customLogoUrl,
  imgClassName,
  ...props
}: CollegeCrestProps) {
  const store = useCollegeStore();
  const logoUrl = customLogoUrl || store.siteSettings?.logoUrl;
  const isDarkBg = variant === "dark";

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={store.siteSettings?.name || "PK College of Engineering & Technology Logo"}
        className={imgClassName || className}
        style={{ objectFit: "contain" }}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="PK College of Engineering & Technology Official Monogram"
      {...props}
    >
      {/* Outer shield container */}
      <path
        d="M50 4 L88 17 V50 C88 74 50 95 50 95 C50 95 12 74 12 50 V17 L50 4 Z"
        fill={isDarkBg ? "#07172f" : "#0b224d"}
        stroke="#d97706"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Inner hairline geometric outline */}
      <path
        d="M50 10 L82 21.5 V49 C82 70 50 89 50 89 C50 89 18 70 18 49 V21.5 L50 10 Z"
        fill="none"
        stroke="#fde68a"
        strokeWidth="1.2"
        strokeOpacity="0.5"
      />

      {/* Bold, authoritative serif "PK" Monogram */}
      <text
        x="50"
        y="53"
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Times New Roman', 'Playfair Display', Georgia, serif"
        fontWeight="800"
        fontSize="34"
        letterSpacing="2.5"
      >
        PK
      </text>

      {/* Elegant institutional divider bar */}
      <line x1="33" y1="67" x2="67" y2="67" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="50" cy="67" r="2.2" fill="#fde68a" />
    </svg>
  );
}
