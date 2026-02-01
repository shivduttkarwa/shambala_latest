import React from "react";

interface HomeLogoProps {
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
}

const HomeLogo: React.FC<HomeLogoProps> = ({
  className = "",
  style,
  ariaLabel = "SHAMBALA",
  onClick,
}) => {
  const publicUrl = import.meta.env.BASE_URL || "/";
  const logoPath = publicUrl.endsWith("/")
    ? `${publicUrl}images/shambala.png`
    : `${publicUrl}/images/shambala.png`;

  return (
    <img
      src={logoPath}
      alt={ariaLabel}
      className={className}
      style={{
        ...style,
        filter: 'brightness(0) invert(1)',
      }}
      onClick={onClick}
      role="img"
      aria-label={ariaLabel}
    />
  );
};

export default HomeLogo;
