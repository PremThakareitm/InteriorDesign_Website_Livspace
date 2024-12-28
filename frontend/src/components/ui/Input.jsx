import { colors } from '../../styles/theme';

const Input = ({
  label,
  error,
  type = 'text',
  className = '',
  fullWidth = true,
  ...props
}) => {
  const baseStyle = `
    rounded-lg
    border border-gray-300
    px-4 py-2
    focus:outline-none focus:ring-2 focus:ring-[${colors.primary.gold}]/20 focus:border-[${colors.primary.gold}]
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
    ${error ? `border-red-500 focus:ring-red-500/20 focus:border-red-500` : ''}
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={baseStyle}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export const Select = ({
  label,
  error,
  options = [],
  className = '',
  fullWidth = true,
  ...props
}) => {
  const baseStyle = `
    rounded-lg
    border border-gray-300
    px-4 py-2
    focus:outline-none focus:ring-2 focus:ring-[${colors.primary.gold}]/20 focus:border-[${colors.primary.gold}]
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
    ${error ? `border-red-500 focus:ring-red-500/20 focus:border-red-500` : ''}
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={baseStyle}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export const TextArea = ({
  label,
  error,
  className = '',
  fullWidth = true,
  rows = 4,
  ...props
}) => {
  const baseStyle = `
    rounded-lg
    border border-gray-300
    px-4 py-2
    focus:outline-none focus:ring-2 focus:ring-[${colors.primary.gold}]/20 focus:border-[${colors.primary.gold}]
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
    ${error ? `border-red-500 focus:ring-red-500/20 focus:border-red-500` : ''}
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={baseStyle}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
