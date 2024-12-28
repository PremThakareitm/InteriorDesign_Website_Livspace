import { motion } from 'framer-motion';
import { colors, transitions } from '../../styles/theme';

const variants = {
  primary: {
    background: colors.primary.gold,
    color: 'white',
    hover: colors.primary.darkGold
  },
  secondary: {
    background: colors.primary.lightGold,
    color: colors.primary.gold,
    hover: `rgba(184, 134, 11, 0.2)`
  },
  outline: {
    background: 'transparent',
    color: colors.primary.gold,
    border: `2px solid ${colors.primary.gold}`,
    hover: colors.primary.lightGold
  }
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
};

const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  children,
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  const baseStyle = `
    inline-flex items-center justify-center
    rounded-lg font-medium transition-all
    ${transitions.default}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}
  `;

  const variantStyle = `
    ${variants[variant].background ? `bg-[${variants[variant].background}]` : ''}
    ${variants[variant].color ? `text-[${variants[variant].color}]` : ''}
    ${variants[variant].border ? `border-2 border-[${variants[variant].border}]` : ''}
    ${!disabled ? `hover:bg-[${variants[variant].hover}]` : ''}
  `;

  return (
    <motion.button
      type={type}
      className={`${baseStyle} ${variantStyle} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
