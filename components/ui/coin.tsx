"use client";

interface CoinProps {
  variant: "gold" | "silver";
  size?: number;
  className?: string;
}

export function Coin({ variant, size = 80, className = "" }: CoinProps) {
  if (variant === "gold") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={className}
        aria-label="Gold coin - correct answer"
      >
        <defs>
          <radialGradient id="goldGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="40%" stopColor="#F5C842" />
            <stop offset="70%" stopColor="#E5A825" />
            <stop offset="100%" stopColor="#C4871E" />
          </radialGradient>
          <radialGradient id="goldInner" cx="45%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#FFD54F" />
            <stop offset="100%" stopColor="#E5A825" />
          </radialGradient>
          <filter id="goldShadow">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              floodColor="#9E7A1A"
              floodOpacity="0.4"
            />
          </filter>
        </defs>
        {/* Outer ring */}
        <circle cx="50" cy="50" r="46" fill="url(#goldGrad)" filter="url(#goldShadow)" />
        {/* Inner rim highlight */}
        <circle cx="50" cy="50" r="42" fill="none" stroke="#FFE082" strokeWidth="1.5" opacity="0.6" />
        {/* Inner circle */}
        <circle cx="50" cy="50" r="36" fill="url(#goldInner)" />
        {/* Star */}
        <path
          d="M50 25 L56.5 40 L73 42 L61 54 L64 70 L50 62 L36 70 L39 54 L27 42 L43.5 40 Z"
          fill="#F9A825"
          stroke="#E5960A"
          strokeWidth="1"
        />
        {/* Star highlight */}
        <path
          d="M50 29 L55 41 L68 43 L59 53 L61.5 66 L50 60 L38.5 66 L41 53 L32 43 L45 41 Z"
          fill="#FFD54F"
          opacity="0.7"
        />
        {/* Shine reflection */}
        <ellipse cx="40" cy="35" rx="12" ry="8" fill="white" opacity="0.2" transform="rotate(-20, 40, 35)" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-label="Silver coin - incorrect answer"
    >
      <defs>
        <radialGradient id="silverGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#E8E8E8" />
          <stop offset="40%" stopColor="#C0C0C0" />
          <stop offset="70%" stopColor="#A8A8A8" />
          <stop offset="100%" stopColor="#888888" />
        </radialGradient>
        <radialGradient id="silverInner" cx="45%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#D8D8D8" />
          <stop offset="100%" stopColor="#A0A0A0" />
        </radialGradient>
        <filter id="silverShadow">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            floodColor="#666666"
            floodOpacity="0.4"
          />
        </filter>
      </defs>
      {/* Outer ring */}
      <circle cx="50" cy="50" r="46" fill="url(#silverGrad)" filter="url(#silverShadow)" />
      {/* Inner rim */}
      <circle cx="50" cy="50" r="42" fill="none" stroke="#D0D0D0" strokeWidth="1.5" opacity="0.6" />
      {/* Inner circle */}
      <circle cx="50" cy="50" r="36" fill="url(#silverInner)" />
      {/* Star */}
      <path
        d="M50 25 L56.5 40 L73 42 L61 54 L64 70 L50 62 L36 70 L39 54 L27 42 L43.5 40 Z"
        fill="#A0A0A0"
        stroke="#808080"
        strokeWidth="1"
      />
      {/* Star inner */}
      <path
        d="M50 29 L55 41 L68 43 L59 53 L61.5 66 L50 60 L38.5 66 L41 53 L32 43 L45 41 Z"
        fill="#C0C0C0"
        opacity="0.7"
      />
      {/* Shine */}
      <ellipse cx="40" cy="35" rx="12" ry="8" fill="white" opacity="0.15" transform="rotate(-20, 40, 35)" />
    </svg>
  );
}
