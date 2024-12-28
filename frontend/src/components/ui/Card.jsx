import { motion } from 'framer-motion';
import { shadows } from '../../styles/theme';

const Card = ({
  children,
  className = '',
  hover = false,
  onClick,
  padding = 'p-6',
  ...props
}) => {
  const baseStyle = `
    bg-white rounded-2xl shadow-md
    ${padding}
    ${hover ? 'transition-all duration-300 hover:shadow-lg' : ''}
    ${onClick ? 'cursor-pointer' : ''}
  `;

  if (onClick) {
    return (
      <motion.div
        className={`${baseStyle} ${className}`}
        onClick={onClick}
        whileHover={{ scale: 1.02, boxShadow: shadows.lg }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseStyle} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
