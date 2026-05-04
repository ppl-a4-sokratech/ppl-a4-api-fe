type LogoProps = {
  size?: number;
  className?: string;
};

export const Logo = ({ size = 28, className = "" }: LogoProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <circle cx="8" cy="16" r="3.5" fill="currentColor" />
    <circle cx="24" cy="8" r="3.5" fill="currentColor" />
    <circle cx="24" cy="24" r="3.5" fill="currentColor" />
    <path
      d="M11 14.5 L21 9.5 M11 17.5 L21 22.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);
