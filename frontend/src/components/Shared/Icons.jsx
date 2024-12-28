const IconWrapper = ({ children, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      {children}
    </svg>
  );
};

export const MenuIcon = ({ className, size }) => (
  <IconWrapper className={className} size={size}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </IconWrapper>
);

export const CloseIcon = ({ className, size }) => (
  <IconWrapper className={className} size={size}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </IconWrapper>
);

export const ProfileIcon = ({ className, size }) => (
  <IconWrapper className={className} size={size}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
    />
    <circle cx="12" cy="7" r="4" />
  </IconWrapper>
);

export const SearchIcon = ({ className, size }) => (
  <IconWrapper className={className} size={size}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </IconWrapper>
);

export const ChevronDownIcon = ({ className, size }) => (
  <IconWrapper className={className} size={size}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 9l-7 7-7-7"
    />
  </IconWrapper>
);

export const NotificationIcon = ({ className, size }) => (
  <IconWrapper className={className} size={size}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </IconWrapper>
);
